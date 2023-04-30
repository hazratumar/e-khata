import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionItem } from "src/transaction-items/entities/transaction-item.entity";
import { TransactionItemController } from "src/transaction-items/transaction-item.controller";
import { TransactionItemService } from "src/transaction-items/transaction-item.service";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem]), UserModule],
  controllers: [TransactionItemController],
  providers: [TransactionItemService],
  exports: [TransactionItemService],
})
export class TransactionItemModule {}
