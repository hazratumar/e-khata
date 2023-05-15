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

  @IsNumberString({}, { message: "Amount must be a valid number" })
  amount: string;

  @IsNumber({}, { message: "Select exchange currency" })
  exCurrency: number;

  @IsNumberString({}, { message: "Exchange rate must be a valid number" })
  @IsOptional()
  exRate?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
