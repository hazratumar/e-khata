import { IsIn } from "class-validator";

export class CreateWalletDto {
  @IsIn(["Credit", "Debit", "Deposit", "Withdraw"], {
    message: "Please select transaction type.",
  })
  type: string;
}
