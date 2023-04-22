import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UserModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionModule {}
