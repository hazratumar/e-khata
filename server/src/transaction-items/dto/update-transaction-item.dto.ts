import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionItemDto } from "src/transaction-items/dto/create-transaction-item.dto";

export class UpdateTransactionItemDto extends PartialType(
  CreateTransactionItemDto
) {}
