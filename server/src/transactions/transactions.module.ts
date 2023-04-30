import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UserModule } from "src/users/users.module";
import { TransactionItemModule } from "src/transaction-items/transaction-item.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TransactionItemModule,
    UserModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionModule {}
