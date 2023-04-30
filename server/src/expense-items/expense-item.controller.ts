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
import { ExpenseItemService } from "./expense-item.service";
import { CreateExpenseItemDto } from "./dto/create-expense-item.dto";
import { UpdateExpenseItemDto } from "./dto/update-expense-item.dto";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";

@Controller("expense-items")
export class ExpenseItemController {
  constructor(private readonly expenseItemService: ExpenseItemService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createExpenseItemDto: CreateExpenseItemDto
  ) {
    return this.expenseItemService.create(+userId, createExpenseItemDto);
  }

  @Get()
  findAll() {
    return this.expenseItemService.findAll();
  }

  @Get(":page/:limit/:searchTerm?")
  find(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.expenseItemService.find(page, limit, searchTerm);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expenseItemService.findOne(+id);
  }

  @Put()
  update(
    @Body("id") id: string,
    @Body() updateExpenseItemDto: UpdateExpenseItemDto
  ) {
    return this.expenseItemService.update(+id, updateExpenseItemDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.expenseItemService.remove(+id);
  }
}
