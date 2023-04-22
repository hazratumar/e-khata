import { IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateExpenseItemDto {
  @IsNotEmpty({ message: "Expense Item name is required" })
  @MaxLength(20, {
    message: "Expense Item name must be less than or equal to 20 characters",
  })
  name: string;

  @IsOptional()
  @MaxLength(150, {
    message: "Detail field must be less than or equal to 150 characters",
  })
  detail?: string;
}
