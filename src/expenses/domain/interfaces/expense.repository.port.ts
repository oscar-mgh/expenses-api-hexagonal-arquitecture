import { ExpensePagination } from 'src/expenses/application/types/expense.types';
import { ExpenseQueryDto } from '../../application/dto/expenses-query.dto';
import { Expense } from '../entity/expense.entity';

export interface ExpenseRepository {
  findAll(ExpenseQueryDto: ExpenseQueryDto): Promise<ExpensePagination>;

  findById(id: number): Promise<Expense | null>;

  update(id: number, expense: Partial<Expense>): Promise<Expense | null>;

  save(expense: Expense): Promise<Expense>;

  delete(id: number): Promise<void>;
}
