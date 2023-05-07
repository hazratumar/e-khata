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
import { WalletService } from "./wallet.service";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { UpdateWalletDto } from "./dto/update-wallet.dto";

@Controller("transaction-items")
export class WalletController {
  constructor(
    private readonly transactionItemService: WalletService
  ) { }

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createWalletDto: CreateWalletDto
  ) {
    return this.transactionItemService.create(
      +userId,
      createWalletDto
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
    @Body() updateWalletDto: UpdateWalletDto
  ) {
    return this.transactionItemService.update(+id, updateWalletDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionItemService.remove(+id);
  }
}
