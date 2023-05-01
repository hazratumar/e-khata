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
import { CreateTransactionItemDto } from "src/transaction-items/dto/create-transaction-item.dto";
import { TransactionItemService } from "src/transaction-items/transaction-item.service";

@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionItemService: TransactionItemService
  ) {}

  @Post()
  async create(
    @GetCurrentUserId() userId: string,
    @Body("isCreated") isCreated: boolean,
    @Body("transaction") transaction: CreateTransactionDto,
    @Body("item") item: CreateTransactionItemDto
  ) {
    if (isCreated) {
      const updatedTransaction = await this.transactionsService.update(
        transaction
      );
      await this.transactionItemService.create(+userId, {
        ...item,
        transaction: updatedTransaction?.id,
      });
      return updatedTransaction;
    }
    if (!isCreated) {
      const createdTransaction = await this.transactionsService.create(
        +userId,
        transaction
      );

      await this.transactionItemService.create(+userId, {
        ...item,
        transaction: createdTransaction?.id,
      });

      return createdTransaction;
    }
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
