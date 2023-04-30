import { Module } from "@nestjs/common";
import { ExpenseItemService } from "./expense-item.service";
import { ExpenseItemController } from "./expense-item.controller";
import { ExpenseItem } from "./entities/expense-item.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseItem]), UserModule],
  controllers: [ExpenseItemController],
  providers: [ExpenseItemService],
})
export class ExpenseItemModule {}
