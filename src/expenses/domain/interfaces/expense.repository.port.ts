import { ExpensePagination } from 'src/expenses/application/types/expense.types';
import { Expense } from '../entity/expense.entity';

type ExpenseQuery = {
  page: number;
  limit: number;
  category?: string;
};

export interface ExpenseRepository {
  findAll(query: ExpenseQuery): Promise<ExpensePagination>;

  findById(id: number): Promise<Expense | null>;

  update(id: number, expense: Partial<Expense>): Promise<Expense | null>;

  save(expense: Expense): Promise<Expense>;

  delete(id: number): Promise<void>;
}
