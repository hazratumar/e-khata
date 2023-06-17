import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAllTransactionDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select a currency" })
  currency: number;

  @IsNotEmpty({ message: "Amount must not be empty" })
  amount: number;

  @IsNumber({}, { message: "Select exchange currency" })
  exCurrency: number;

  @IsNotEmpty({ message: "Exchange rate must not be empty" })
  exRate?: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
