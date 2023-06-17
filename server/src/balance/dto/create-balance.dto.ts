import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateBalanceDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select a currency" })
  currency: number;

  @IsNotEmpty({ message: "Amount must not be empty" })
  amount: number;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
