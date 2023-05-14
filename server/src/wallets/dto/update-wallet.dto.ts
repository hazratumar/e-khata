import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional } from "class-validator";
import { CreateDebitWalletDto } from "./create-debit-wallet.dto";

export class UpdateWalletDto extends PartialType(CreateDebitWalletDto) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
