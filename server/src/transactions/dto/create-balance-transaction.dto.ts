import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateBalanceDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select a currency" })
  currency: number;

  @IsNumberString({}, { message: "Amount must be a valid number" })
  amount: string;

  @IsOptional()
  @IsString({ message: "Description must be a string" })
  description?: string;
}
