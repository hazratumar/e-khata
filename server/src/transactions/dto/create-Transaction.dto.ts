import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty({ message: "Amount must not be empty" })
  @IsNumber({}, { message: "Amount must be a valid number" })
  amount: number;

  @IsOptional()
  @IsNumber({}, { message: "Exchange rate must be a valid number" })
  exRate?: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
