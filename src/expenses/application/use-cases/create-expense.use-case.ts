import { Inject } from '@nestjs/common';
import { type ExpenseRepository } from 'src/expenses/domain/interfaces/expense.repository.port';
import { EXPENSE_REPOSITORY } from 'src/expenses/tokens';
import { Expense } from '../../domain/entity/expense.entity';
import { CreateExpenseDto } from '../dto/create-expense.dto';

export class CreateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private repo: ExpenseRepository,
  ) {}

  async execute(dto: CreateExpenseDto): Promise<Expense> {
    const expense = new Expense(
      0,
      dto.description,
      dto.amount,
      dto.category,
      new Date(),
    );

    await this.repo.save(expense);

    return expense;
  }
}
