import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBalanceWalletDto {
  @IsNotEmpty()
  @IsNumber({}, { message: "Please select customer" })
  customer: number;

  @IsIn(["Deposit", "Withdraw"], {
    message: "Please select a valid transaction type.",
  })
  type: string;
}
