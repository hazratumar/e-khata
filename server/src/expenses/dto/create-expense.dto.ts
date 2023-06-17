import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  ValidateIf,
} from "class-validator";

export class CreateExpenseDto {
  @IsNotEmpty({ message: "Expense price is required" })
  @IsNumber({}, { message: "Expense price must be a number" })
  price: number;

  @ValidateIf((o) => o.quantity !== "")
  @IsNotEmpty({ message: "Expense quantity is required" })
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
