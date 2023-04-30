import { Transform, Type } from "class-transformer";
import { IsIn, ValidateNested, ArrayMinSize } from "class-validator";
import { TransactionItem } from "./create-transaction-item.dto";

export class CreateTransactionDto {
  @IsIn(["Buy", "Sale"], {
    message: 'Please enter either "Buy" or "Sale".',
  })
  type: string;

  @IsIn(["Pending", "Cash"], {
    message: 'Please enter either "Pending" or "Cash".',
  })
  status: string;

  @ValidateNested({ each: true })
  @Type(() => TransactionItem)
  @ArrayMinSize(1, { message: "At least one credit is required" })
  transactionItem: TransactionItem[];
}
