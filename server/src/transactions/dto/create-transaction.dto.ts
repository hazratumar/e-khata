import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsIn,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Currency } from "src/currency/entities/currency.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Credits } from "./create-credits.dto";

export class CreateTransactionDto {
  @IsNotEmpty({ message: "Please select debit customer name" })
  debitFrom: Customer;

  @IsNotEmpty({ message: "Please select debit customer name" })
  debitTo: Customer;

  @IsNotEmpty({ message: "Please select currency" })
  currency: Currency;

  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  amount: number;

  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  rate: number;

  @Transform(({ value }) => (value === "" || value === null ? 0 : value))
  profit: number;

  @IsIn(["Pending", "Cash"], {
    message: 'Please enter either "Pending" or "Cash".',
  })
  status: string;

  @ValidateNested({ each: true })
  @Type(() => Credits)
  @ArrayMinSize(1, { message: "At least one credit is required" })
  credits: Credits[];
}
