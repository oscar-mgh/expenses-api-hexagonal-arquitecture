import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'A brief description of the expense',
    example: 'Office supplies',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The amount of the expense as a string (numeric value)',
    example: '150.50',
    pattern: '^(?!0+(\.0+)?$)\\d+(\\.\\d{1,2})?$',
  })
  @IsNumberString()
  @Matches(/^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/, {
    message: 'amount must be greater than 0',
  })
  amount: string;

  @ApiProperty({
    description: 'The category name for the expense',
    example: 'Food',
  })
  @IsString()
  category: string;
}