import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateTransactionItemDto {
  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  from: number;

  @IsNotEmpty()
  @IsNumber()
  to: number;

  @IsNotEmpty()
  @IsNumber()
  currency: number;

  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsString()
  rate: string;

  @IsNotEmpty()
  @IsString()
  profit: string;

  @IsNotEmpty()
  @IsNumber()
  transaction: number;
}
