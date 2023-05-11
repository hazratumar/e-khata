import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateTransactionDto {
  @IsNumberString({}, { message: "Amount must be a valid number" })
  amount: string;

  @IsNumberString({}, { message: "Exchange rate must be a valid number" })
  @IsOptional()
  exRate?: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
