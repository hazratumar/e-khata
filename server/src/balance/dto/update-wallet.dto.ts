import { PartialType } from "@nestjs/mapped-types";
import { IsNumber } from "class-validator";
import { CreateWalletDto } from "./create-wallet.dto";

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsNumber()
  id: number;
}
