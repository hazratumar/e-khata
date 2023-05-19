import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";
import { TransactionModule } from "src/transactions/transactions.module";
import { CustomerModule } from "src/customers/customers.module";
import { BalanceController } from "./balance.controller";
import { BalanceService } from "./balance.service";
import { WalletModule } from "src/wallets/wallet.module";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { CurrencyModule } from "src/currency/currency.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TypeOrmModule.forFeature([Transaction]),
    WalletModule,
    TransactionModule,
    CustomerModule,
    CurrencyModule,
    UserModule,
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalanceModule {}
