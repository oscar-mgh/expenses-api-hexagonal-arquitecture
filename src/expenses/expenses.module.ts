import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './infrastructure/repositories/expense.entity';
import { ExpensesController } from './presentation/controllers/expenses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity])],
  controllers: [ExpensesController],
  providers: [],
  exports: [TypeOrmModule],
})
export class ExpensesModule {}
