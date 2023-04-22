import { Module } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";
import { Expense } from "./entities/expense.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Expense]), UserModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
