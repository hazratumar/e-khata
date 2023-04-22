import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateExpenseDto {
  @IsNotEmpty({ message: "Expense amount is required" })
  @IsNumber({}, { message: "Expense amount must be a number" })
  amount: number;

  @ValidateIf((o) => o.quantity !== "")
  @IsNotEmpty({ message: "Expense quantity is required" })
  @IsNumber({}, { message: "Expense quantity must be a number" })
  @MaxLength(10, {
    message: "Expense quantity must be less than or equal to 10 digits",
  })
  quantity: number;

  @IsOptional()
  @MaxLength(150, {
    message: "Expense detail must be less than or equal to 150 characters",
  })
  detail?: string;
}
