import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { CreateBalanceWalletDto } from "./dto/create-balance-wallet.dto";
import { TransactionsService } from "src/transactions/transactions.service";
import { WalletService } from "src/wallets/wallet.service";
import { BalanceService } from "./balance.service";

@Controller("balance")
export class BalanceController {
  constructor(
    private readonly balanceService: BalanceService,
    private readonly walletService: WalletService,
    private readonly transactionsService: TransactionsService
  ) {}

  @Post()
  async createBalance(
    @GetCurrentUserId() userId: string,
    @Body("balance") balance: CreateBalanceDto,
    @Body("wallet") wallet: CreateBalanceWalletDto
  ) {
    const savedTransaction = await this.transactionsService.create(
      +userId,
      balance
    );
    await this.walletService.create(+userId, wallet, savedTransaction?.id);
    return savedTransaction;
  }

  @Get(":page/:limit/:searchTerm?")
  getBalanceList(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.balanceService.balanceList(page, limit, searchTerm);
  }

  @Get(":id")
  getBalanceById(@Param("id") id: string | null) {
    return this.walletService.findOne(+id);
  }
}
