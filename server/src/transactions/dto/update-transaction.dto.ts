import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateAllTransactionDto } from "./create-all-transaction.dto";

export class UpdateTransactionDto extends PartialType(CreateAllTransactionDto) {
  @IsNumber()
  id: number;
}
