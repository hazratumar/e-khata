import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { GetCurrentUserId } from "src/common/decorators";
import { WalletService } from "src/wallets/wallet.service";
import { CreateWalletDto } from "src/wallets/dto/create-wallet.dto";
import { CreateTransactionDto } from "./dto/create-Transaction.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletService: WalletService
  ) {}

  @Post()
  async create(
    @GetCurrentUserId() userId: string,
    @Body("transaction") transaction: CreateTransactionDto,
    @Body("credit") credit: CreateWalletDto,
    @Body("debit") debit: CreateWalletDto
  ) {
    const savedTransaction = await this.transactionsService.create(
      +userId,
      transaction
    );
    await this.walletService.create(+userId, credit, savedTransaction?.id);
    await this.walletService.create(+userId, debit, savedTransaction?.id);
    return savedTransaction;
  }

  @Get()
  find() {
    return this.transactionsService.find();
  }

  @Get(":page/:limit/:searchTerm?")
  findAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.transactionsService.findAll(page, limit, searchTerm);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionsService.remove(+id);
  }
}
