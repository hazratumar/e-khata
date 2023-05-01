import { IsIn, IsOptional } from "class-validator";

export class CreateTransactionDto {
  @IsOptional()
  id?: number;

  @IsIn(["Buy", "Sale"], {
    message: 'Please enter either "Buy" or "Sale".',
  })
  type: string;

  @IsIn(["Pending", "Cash"], {
    message: 'Please enter either "Pending" or "Cash".',
  })
  status: string;
}
