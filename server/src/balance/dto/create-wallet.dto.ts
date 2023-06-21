import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateWalletDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Please select customer." })
  customerId: number;

  @IsIn(["Deposit", "Withdraw"], {
    message: "Please select transaction type.",
  })
  type: string;
}
