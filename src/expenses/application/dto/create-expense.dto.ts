import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumberString()
  @Matches(/^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/, {
    message: 'amount must be greater than 0',
  })
  amount: string;

  @IsString()
  category: string;
}
