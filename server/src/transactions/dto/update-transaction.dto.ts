import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateTransactionDto } from "./create-Transaction.dto copy";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    @IsNumber()
    id: number;
}
