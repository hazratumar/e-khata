import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDto } from "./create-transaction.dto";
import { Transaction } from "../entities/transaction.entity";

export class UpdateTransactionDto extends PartialType(Transaction) {}
