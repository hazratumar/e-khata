import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  Put,
} from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators";
import { CreateBalanceDto } from "./dto/create-balance.dto";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { TransactionsService } from "src/transactions/transactions.service";
import { WalletService } from "src/wallets/wallet.service";
import { BalanceService } from "./balance.service";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";

@Controller("balances")
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
    @Body("wallet") wallet: CreateWalletDto
  ) {
    const savedTransaction = await this.transactionsService.create(
      +userId,
      balance
    );
    await this.walletService.create(+userId, wallet, savedTransaction?.id);
    return savedTransaction;
  }
  @Put()
  async updateBalance(
    @GetCurrentUserId() userId: string,
    @Body("balance") balance: UpdateBalanceDto,
    @Body("wallet") wallet: UpdateWalletDto
  ) {
    await this.balanceService.updateBalance(+userId, balance);
    return this.balanceService.updateWallet(+userId, wallet);
  }

  @Get("by_currency")
  async getBalancesByCurrency() {
    return this.balanceService.getBalancesByCurrency();
  }

  @Get("by_customer")
  async getBalancesByCustomer() {
    return this.balanceService.getBalancesByCustomer();
  }

  @Get("credit_by_date/:startDate/:endDate")
  async getCreditByDateRange(
    @Param("startDate") startDate: Date,
    @Param("endDate") endDate: Date
  ) {
    return this.balanceService.getBalancesByDateRange(startDate, endDate);
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
