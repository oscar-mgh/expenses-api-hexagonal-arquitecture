import { Inject, NotFoundException } from '@nestjs/common';
import { Expense } from 'src/expenses/domain/entity/expense.entity';
import { EXPENSE_REPOSITORY } from 'src/expenses/tokens';
import { type ExpenseRepository } from '../../domain/interfaces/expense.repository.port';

export class FindExpenseByIdUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private repo: ExpenseRepository,
  ) {}

  async execute(id: number): Promise<Expense | null> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return exists;
  }
}
