import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CreateCurrencyDto } from "./dto/create-currency.dto";
import { UpdateCurrencyDto } from "./dto/update-currency.dto";
import { GetCurrentUserId } from "src/common/decorators";

@Controller("currencies")
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) { }

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createCurrencyDto: CreateCurrencyDto
  ) {
    return this.currencyService.create(+userId, createCurrencyDto);
  }

  @Get()
  find() {
    return this.currencyService.find();
  }

  @Get(":page/:limit/:searchTerm?")
  findAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.currencyService.findAll(page, limit, searchTerm);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.currencyService.findOne(+id);
  }

  @Put()
  update(@Body("id") id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currencyService.update(+id, updateCurrencyDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.currencyService.remove(+id);
  }
}
