import { IsNotEmpty, IsString, IsNumber, IsIn } from "class-validator";

export class CreateTransactionItemDto {
  @IsIn(["Credit", "Debit"], {
    message: 'Please select "Credit" or "Debit".',
  })
  type: string;

  @IsNotEmpty({ message: "From field cannot be empty" })
  @IsNumber({}, { message: `Select from customer` })
  from: number;

  @IsNotEmpty({ message: "To field cannot be empty" })
  @IsNumber({}, { message: "Select to customerr" })
  to: number;

  @IsNotEmpty({ message: "Currency field cannot be empty" })
  @IsNumber({}, { message: "Currency field must be a number" })
  currency: number;

  @IsNotEmpty({ message: "Amount field cannot be empty" })
  @IsString({ message: "Amount field must be a string" })
  amount: string;
}
