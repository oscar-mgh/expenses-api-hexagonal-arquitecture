import { ApiProperty } from '@nestjs/swagger';
import { type Expense } from 'src/expenses/domain/entity/expense.entity';
import { ExpenseEntity } from 'src/expenses/infrastructure/repositories/expense.entity';

export interface ExpensePagination {
  data: Expense[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export abstract class PaginationMetaDoc {
  @ApiProperty({ example: 100, description: 'Total number of expenses' })
  total: number;
  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;
  @ApiProperty({ example: 10, description: 'Total number of pages' })
  lastPage: number;
}

export abstract class ExpensePaginationMetaDoc implements ExpensePagination {
  @ApiProperty({ type: [ExpenseEntity], description: 'List of expenses' })
  data: Expense[];
  @ApiProperty({ type: PaginationMetaDoc })
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
