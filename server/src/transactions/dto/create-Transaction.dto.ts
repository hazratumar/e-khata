import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty({ message: "Amount must not be empty" })
  amount: number;

  @IsNotEmpty({ message: "Exchange rate must not be empty" })
  exRate?: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
