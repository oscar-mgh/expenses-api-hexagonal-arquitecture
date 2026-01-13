import { Inject } from '@nestjs/common';
import { EXPENSE_REPOSITORY } from 'src/expenses/tokens';
import { Expense } from '../../domain/entity/expense.entity';
import { type ExpenseRepository } from '../../domain/interfaces/expense.repository.port';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

export class UpdateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private repo: ExpenseRepository,
  ) {}

  async execute(id: number, dto: UpdateExpenseDto): Promise<Expense | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;

    const updateData: Partial<Expense> = {
      description: dto.description,
      amount: dto.amount,
      category: dto.category,
    };

    return this.repo.update(id, updateData);
  }
}
