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
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
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
    // if (isCreated) {
    //   return this.transactionsService.create(+userId, id, type, status);
    // }
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

  @Put()
  update(
    @Body("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionsService.remove(+id);
  }
}
