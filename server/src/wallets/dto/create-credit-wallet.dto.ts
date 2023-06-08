import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCreditWalletDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Select credit customer." })
  customer: number;

  @IsIn(["Credit"], {
    message: "Please select transaction type.",
  })
  type: string;
}
