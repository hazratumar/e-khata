import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsIn,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { TransactionItem } from "./create-transaction-type.dto";

export class CreateTransactionDto {
  @IsIn(["Buy", "Sell"], {
    message: 'Please enter either "Buy" or "Sell".',
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
