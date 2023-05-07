import { IsIn } from 'class-validator';

export class CreateWalletDto {
  @IsIn(["Credit", "Debit", "Deposit", "Withdrawal"], {
    message: 'Please select a valid transaction type.',
  })
  type: string;
}
