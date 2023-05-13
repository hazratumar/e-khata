import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { UpdateWalletDto } from "./dto/update-wallet.dto";

@Controller("wallets")
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(":page/:limit/:searchTerm?")
  find(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.walletService.find(page, limit, searchTerm);
  }

  @Get(":id")
  getByTransaction(@Param("id") id: string | null) {
    if (id === null || isNaN(+id)) {
      return [];
    } else {
      return this.walletService.getByTransaction(+id);
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.walletService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.walletService.remove(+id);
  }
}
