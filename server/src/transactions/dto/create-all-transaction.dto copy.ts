import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateAllTransactionDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select a currency" })
  currency: number;

  @IsNotEmpty({ message: "Amount must not be empty" })
  @IsNumber({}, { message: "Amount must be a valid number" })
  amount: number;

  @IsNumber({}, { message: "Select exchange currency" })
  exCurrency: number;

  @IsOptional()
  @IsNumber({}, { message: "Exchange rate must be a valid number" })
  exRate?: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
