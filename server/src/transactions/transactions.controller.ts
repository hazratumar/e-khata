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
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { GetCurrentUserId } from "src/common/decorators";
import { WalletService } from "src/wallets/wallet.service";
import { CreateWalletDto } from "src/wallets/dto/create-wallet.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionItemService: WalletService
  ) { }

  @Post()
  async create(
    @GetCurrentUserId() userId: string,
    @Body("transaction") transaction: CreateTransactionDto,
    @Body("item") item: CreateWalletDto,
    @Body("isCreated") isCreated: boolean
  ) {
    const tx = isCreated
      ? await this.transactionsService.update(transaction)
      : await this.transactionsService.create(+userId, transaction);

    await this.transactionItemService.create(+userId, {
      ...item,
      transaction: tx?.id,
    });

    return tx;
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
