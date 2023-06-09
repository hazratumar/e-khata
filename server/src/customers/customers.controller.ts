import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer";
import { GetCurrentUserId } from "src/common/decorators";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: string,
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    return this.customersService.create(+userId, createCustomerDto);
  }
  @Get()
  getOptions() {
    return this.customersService.getOptions();
  }
  @Get("self")
  getBalanceOptions() {
    return this.customersService.getBalanceOptions();
  }

  @Get("history/:id")
  customerHistory(@Param("id") id: string) {
    return this.customersService.customerHistory(+id);
  }
  @Get("khata/:id")
  customerKhata(@Param("id") id: string) {
    return this.customersService.customerKhata(+id);
  }

  @Get("detail/:id")
  customerDetail(@Param("id") id: string) {
    return this.customersService.customerDetail(+id);
  }

  @Get(":page/:limit/:searchTerm?")
  findAll(
    @Param("page", ParseIntPipe) page: number,
    @Param("limit", ParseIntPipe) limit: number,
    @Param("searchTerm") searchTerm: string
  ) {
    return this.customersService.findAll(page, limit, searchTerm);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(+id);
  }

  @Put()
  update(@Body("id") id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customersService.remove(+id);
  }
}
