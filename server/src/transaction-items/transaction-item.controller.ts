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
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { TransactionItemService } from "src/transaction-items/transaction-item.service";
import { CreateTransactionItemDto } from "src/transaction-items/dto/create-transaction-item.dto";
import { UpdateTransactionItemDto } from "src/transaction-items/dto/update-transaction-item.dto";

@Controller("transaction-items")
export class TransactionItemController {
  constructor(
    private readonly transactionItemService: TransactionItemService
  ) {}

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createTransactionItemDto: CreateTransactionItemDto
  ) {
    return this.transactionItemService.create(
      +userId,
      createTransactionItemDto
    );
  }

  @Get(":page/:limit/:searchTerm?")
  find(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.transactionItemService.find(page, limit, searchTerm);
  }

  @Get(":id")
  getByTransaction(@Param("id") id: string | null) {
    if (id === null || isNaN(+id)) {
      return [];
    } else {
      return this.transactionItemService.getByTransaction(+id);
    }
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.transactionItemService.findOne(+id);
  }

  @Put()
  update(
    @Body("id") id: string,
    @Body() updateTransactionItemDto: UpdateTransactionItemDto
  ) {
    return this.transactionItemService.update(+id, updateTransactionItemDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionItemService.remove(+id);
  }
}
