import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { GetCurrentUserId } from "src/common/decorators";
import { WalletService } from "src/wallets/wallet.service";
import { CreateCreditWalletDto } from "src/wallets/dto/create-credit-wallet.dto";
import { CreateDebitWalletDto } from "src/wallets/dto/create-debit-wallet.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { CreateAllTransactionDto } from "./dto/create-all-transaction.dto copy";
@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly walletService: WalletService
  ) {}

  @Post()
  async create(
    @GetCurrentUserId() userId: string,
    @Body("transaction") transaction: CreateAllTransactionDto,
    @Body("debit") debit: CreateDebitWalletDto,
    @Body("credit") credit: CreateCreditWalletDto
  ) {
    const { customer: cr } = credit;
    const { customer: db } = debit;

    await this.transactionsService.validateTransaction(cr, db);

    const t = await this.transactionsService.create(+userId, transaction);

    await Promise.all([
      this.walletService.create(+userId, credit, t.id, db),
      this.walletService.create(+userId, debit, t.id, cr),
    ]);

    return t;
  }

  @Put()
  async update(
    @GetCurrentUserId() userId: string,
    @Body("transaction") transaction: UpdateTransactionDto,
    @Body("debit") debit: CreateDebitWalletDto,
    @Body("credit") credit: CreateCreditWalletDto
  ) {
    const { customer: cr } = credit;
    const { customer: db } = debit;

    await this.transactionsService.validateTransaction(cr, db);

    await Promise.all([
      this.walletService.update(+userId, debit, cr),
      this.walletService.update(+userId, credit, db),
    ]);

    return this.transactionsService.update(+userId, transaction);
  }

  @Get(":page/:limit/:searchTerm?")
  transactionListing(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.walletService.transactionListing(page, limit, searchTerm);
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
