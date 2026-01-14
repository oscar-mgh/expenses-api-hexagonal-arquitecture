import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { expensesSeedData } from './data/expenses.seed';
import { ExpenseEntity } from 'src/expenses/infrastructure/repositories/expense.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepo: Repository<ExpenseEntity>,
  ) {}

  async seedExpenses() {
    this.blockInProduction();

    const count = await this.expenseRepo.count();

    if (count > 0) {
      this.logger.warn('Expenses table already has data. Seed skipped.');
      return { message: 'Seed already executed' };
    }

    const expenses = this.expenseRepo.create(expensesSeedData);
    await this.expenseRepo.save(expenses);

    this.logger.log(`Seed completed: ${expenses.length} expenses inserted`);

    return {
      message: 'Seed completed successfully',
      totalInserted: expenses.length,
    };
  }

  private blockInProduction() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException('Operation disabled in production');
    }
  }

  async clearExpenses() {
    this.blockInProduction();
    await this.expenseRepo.query(
      'TRUNCATE TABLE expenses RESTART IDENTITY CASCADE',
    );

    this.logger.warn('Expenses table cleared');

    return {
      message: 'Expenses table cleared',
    };
  }
}
