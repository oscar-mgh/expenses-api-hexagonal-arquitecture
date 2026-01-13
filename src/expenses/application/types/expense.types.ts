import { type Expense } from 'src/expenses/domain/entity/expense.entity';

export interface ExpensePagination {
  data: Expense[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
