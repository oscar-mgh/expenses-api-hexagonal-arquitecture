import { Inject, NotFoundException } from '@nestjs/common';
import { type ExpenseRepository } from 'src/expenses/domain/interfaces/expense.repository.port';
import { EXPENSE_REPOSITORY } from 'src/expenses/tokens';

export class DeleteExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private repo: ExpenseRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const exists = await this.repo.findById(id);
    if (!exists) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    await this.repo.delete(id);
  }
}
