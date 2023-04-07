import { Controller, Get, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer";
import { Public } from "src/common/decorators";
@Public()

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Get(':page/:limit')
    findAll(@Param('page') page: number, @Param('limit') limit: number) {
        return this.customersService.findAll(page, limit);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.customersService.findOne(id);
    }

    @Post()
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.customersService.remove(id);
    }
}

