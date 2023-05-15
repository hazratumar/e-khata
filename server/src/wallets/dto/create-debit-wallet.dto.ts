import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateDebitWalletDto {
  @IsNotEmpty({ message: "Select debit customer" })
  @IsNumber({}, { message: "Select debit customer" })
  customer: number;

  @IsIn(["Debit"], {
    message: "Please select a valid transaction type.",
  })
  type: string;
}
