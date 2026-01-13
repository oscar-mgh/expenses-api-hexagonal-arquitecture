import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateExpenseUseCase } from './application/use-cases/create-expense.use-case';
import { DeleteExpenseUseCase } from './application/use-cases/delete.expense.use-case';
import { FindAllExpensesUseCase } from './application/use-cases/find-all.expense.use-case';
import { FindExpenseByIdUseCase } from './application/use-cases/find-expense-by-id.use-case';
import { UpdateExpenseUseCase } from './application/use-cases/update-expense.use-case';
import { ExpenseRepository } from './domain/interfaces/expense.repository.port';
import { ExpenseEntity } from './infrastructure/repositories/expense.entity';
import { TypeOrmExpenseRepositoryAdapter } from './infrastructure/repositories/typeorm-expense.repository.adapter';
import { EXPENSE_REPOSITORY } from './tokens';

const useCases = [
  {
    provide: CreateExpenseUseCase,
    inject: [EXPENSE_REPOSITORY],
    useFactory: (repo: ExpenseRepository) => new CreateExpenseUseCase(repo),
  },
  {
    provide: FindAllExpensesUseCase,
    inject: [EXPENSE_REPOSITORY],
    useFactory: (repo: ExpenseRepository) => new FindAllExpensesUseCase(repo),
  },
  {
    provide: FindExpenseByIdUseCase,
    inject: [EXPENSE_REPOSITORY],
    useFactory: (repo: ExpenseRepository) => new FindExpenseByIdUseCase(repo),
  },
  {
    provide: UpdateExpenseUseCase,
    inject: [EXPENSE_REPOSITORY],
    useFactory: (repo: ExpenseRepository) => new UpdateExpenseUseCase(repo),
  },
  {
    provide: DeleteExpenseUseCase,
    inject: [EXPENSE_REPOSITORY],
    useFactory: (repo: ExpenseRepository) => new DeleteExpenseUseCase(repo),
  },
];

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity])],
  controllers: [],
  providers: [
    {
      provide: EXPENSE_REPOSITORY,
      useClass: TypeOrmExpenseRepositoryAdapter,
    },
    ...useCases,
  ],
  exports: [TypeOrmModule],
})
export class ExpensesModule {}
