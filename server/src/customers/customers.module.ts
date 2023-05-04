import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { CustomersController } from "./customers.controller";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), UserModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
