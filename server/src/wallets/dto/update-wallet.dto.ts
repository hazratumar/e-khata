import { PartialType } from "@nestjs/mapped-types";
import { CreateWalletDto } from "./create-wallet.dto";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsNumber()
  @IsOptional()
  id?: number;
}
