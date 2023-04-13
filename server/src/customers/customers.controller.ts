import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
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
    return this.customersService.create(userId, createCustomerDto);
  }

  @Get(":page/:limit")
  findAll(@Param("page") page: string, @Param("limit") limit: string) {
    return this.customersService.findAll(+page, +limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(+id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @GetCurrentUserId() userId: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(+id, +userId, updateCustomerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customersService.remove(+id);
  }
}
