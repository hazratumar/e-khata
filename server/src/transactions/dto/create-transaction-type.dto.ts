import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class TransactionItem {
  @IsNotEmpty({ message: "Id is required" })
  id: number;

  @IsNotEmpty({ message: "Type is required" })
  type: "credit" | "debit";

  @IsNotEmpty({ message: "From is required" })
  @IsNumber({}, { message: "From must be a number" })
  from: number;

  @IsNotEmpty({ message: "To is required" })
  @IsNumber({}, { message: "To must be a number" })
  to: number;

  @IsNotEmpty({ message: "Currency is required" })
  @IsNumber({}, { message: "Currency must be a number" })
  currency: number;

  @IsNotEmpty({ message: "Amount is required" })
  @IsNumber({}, { message: "Amount must be a number" })
  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  amount: number;

  @IsNotEmpty({ message: "Rate is required" })
  @IsNumber({}, { message: "Rate must be a number" })
  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  rate: number;

  @IsNotEmpty({ message: "Profit is required" })
  @IsNumber({}, { message: "Profit must be a number" })
  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  profit: number;
}
