import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Validate } from 'class-validator';

export class CreateAllTransactionDto {
  @IsNotEmpty({ message: 'Select credit customer' })
  @IsNumber({}, { message: 'Select credit customer' })
  creditCustomer: number;

  @IsNotEmpty({ message: 'Select debit customer' })
  @IsNumber({}, { message: 'Select debit customer' })
  debitCustomer: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'Select a currency' })
  currency: number;

  @IsNumberString({}, { message: 'Amount must be a valid number' })
  amount: string;

  @IsNumber({}, { message: 'Select exchange currency' })
  exCurrency: number;

  @IsNumberString({}, { message: 'Exchange rate must be a valid number' })
  @IsOptional()
  exRate?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Validate((obj: CreateAllTransactionDto) => {
    if (obj.creditCustomer === obj.debitCustomer) {
      return { message: 'Credit customer and debit customer cannot be the same' };
    }
  })
  sameCustomerCheck?: boolean;
}
