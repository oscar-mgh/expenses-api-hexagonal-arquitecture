import { Inject } from '@nestjs/common';
import { EXPENSE_REPOSITORY } from 'src/expenses/tokens';
import { type ExpenseRepository } from '../../domain/interfaces/expense.repository.port';
import { ExpenseQueryDto } from '../dto/expenses-query.dto';
import { ExpensePagination } from '../types/expense.types';

export class FindAllExpensesUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private repo: ExpenseRepository,
  ) {}

  async execute(query: ExpenseQueryDto): Promise<ExpensePagination> {
    return this.repo.findAll(query);
  }
}
