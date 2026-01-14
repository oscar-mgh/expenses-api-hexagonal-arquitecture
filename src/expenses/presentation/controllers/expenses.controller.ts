import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateExpenseDto } from 'src/expenses/application/dto/create-expense.dto';
import { ExpenseQueryDto } from 'src/expenses/application/dto/expenses-query.dto';
import { UpdateExpenseDto } from 'src/expenses/application/dto/update-expense.dto';
import { CreateExpenseUseCase } from 'src/expenses/application/use-cases/create-expense.use-case';
import { DeleteExpenseUseCase } from 'src/expenses/application/use-cases/delete.expense.use-case';
import { FindAllExpensesUseCase } from 'src/expenses/application/use-cases/find-all.expense.use-case';
import { FindExpenseByIdUseCase } from 'src/expenses/application/use-cases/find-expense-by-id.use-case';
import { UpdateExpenseUseCase } from 'src/expenses/application/use-cases/update-expense.use-case';

@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly createExpenseUseCase: CreateExpenseUseCase,
    private readonly updateExpenseUseCase: UpdateExpenseUseCase,
    private readonly findAllExpensesUseCase: FindAllExpensesUseCase,
    private readonly findExpenseByIdUseCase: FindExpenseByIdUseCase,
    private readonly deleteExpenseUseCase: DeleteExpenseUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateExpenseDto) {
    return this.createExpenseUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryDto: ExpenseQueryDto) {
    return this.findAllExpensesUseCase.execute(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.findExpenseByIdUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateExpenseDto) {
    return this.updateExpenseUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.deleteExpenseUseCase.execute(id);
  }
}
