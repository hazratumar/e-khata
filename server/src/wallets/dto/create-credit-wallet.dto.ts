import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCreditWalletDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select credit customer" })
  customer: number;

  @IsIn(["Credit"], {
    message: "Please select a valid transaction type.",
  })
  type: string;
}