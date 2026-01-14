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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateExpenseDto } from 'src/expenses/application/dto/create-expense.dto';
import { ExpenseQueryDto } from 'src/expenses/application/dto/expenses-query.dto';
import { UpdateExpenseDto } from 'src/expenses/application/dto/update-expense.dto';
import { ExpensePaginationMetaDoc } from 'src/expenses/application/types/expense.types';
import { CreateExpenseUseCase } from 'src/expenses/application/use-cases/create-expense.use-case';
import { DeleteExpenseUseCase } from 'src/expenses/application/use-cases/delete.expense.use-case';
import { FindAllExpensesUseCase } from 'src/expenses/application/use-cases/find-all.expense.use-case';
import { FindExpenseByIdUseCase } from 'src/expenses/application/use-cases/find-expense-by-id.use-case';
import { UpdateExpenseUseCase } from 'src/expenses/application/use-cases/update-expense.use-case';
import { ExpenseEntity } from 'src/expenses/infrastructure/repositories/expense.entity';

@ApiTags('Expenses')
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
  @ApiResponse({
    status: 201,
    description: 'Expense created',
    type: ExpenseEntity,
  })
  create(@Body() dto: CreateExpenseDto) {
    return this.createExpenseUseCase.execute(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Fetched expenses with pagination',
    type: ExpensePaginationMetaDoc,
  })
  findAll(@Query() queryDto: ExpenseQueryDto) {
    return this.findAllExpensesUseCase.execute(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Expense found',
    type: ExpenseEntity,
  })
  findOne(@Param('id') id: number) {
    return this.findExpenseByIdUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Expense updated',
    type: ExpenseEntity,
  })
  async update(@Param('id') id: number, @Body() dto: UpdateExpenseDto) {
    return this.updateExpenseUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Expense deleted',
  })
  remove(@Param('id') id: number) {
    return this.deleteExpenseUseCase.execute(id);
  }
}
