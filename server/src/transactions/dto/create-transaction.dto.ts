import { IsIn } from "class-validator";

export class CreateTransactionDto {
  @IsIn(["Buy", "Sale"], {
    message: 'Please enter either "Buy" or "Sale".',
  })
  type: string;

  @IsIn(["Pending", "Cash"], {
    message: 'Please enter either "Pending" or "Cash".',
  })
  status: string;
}
