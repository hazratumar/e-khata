import { IsNotEmpty, IsNumber, IsEnum, IsDateString } from "class-validator";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  currencyId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(["deposit", "withdrawal"])
  type: "deposit" | "withdrawal";

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}
