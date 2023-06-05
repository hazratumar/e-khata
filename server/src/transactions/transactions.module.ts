import { Module, forwardRef } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UserModule } from "src/users/users.module";
import { WalletModule } from "src/wallets/wallet.module";
import { CustomerModule } from "src/customers/customers.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => WalletModule),
    CustomerModule,
    UserModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionModule {}
