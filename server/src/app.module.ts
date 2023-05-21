import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { UserModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { CustomerModule } from "./customers/customers.module";
import { Customer } from "./customers/entities/customer.entity";
import { CurrencyModule } from "./currency/currency.module";
import { TransactionModule } from "./transactions/transactions.module";
import { Transaction } from "./transactions/entities/transaction.entity";
import { Currency } from "./currency/entities/currency.entity";
import { Expense } from "./expenses/entities/expense.entity";
import { ExpenseModule } from "./expenses/expense.module";
import { ExpenseItemModule } from "./expense-items/expense-item.module";
import { ExpenseItem } from "./expense-items/entities/expense-item.entity";
import { Wallet } from "./wallets/entities/wallet.entity";
import { WalletModule } from "./wallets/wallet.module";
import { BalanceModule } from "./balance/balance.module";
import { PrinterModule } from "./Printer/printer.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: "/assets",
      rootPath: join(__dirname, "assets"),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "e-khata",
      entities: [
        User,
        Customer,
        Currency,
        Wallet,
        Transaction,
        ExpenseItem,
        Expense,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Customer,
      Currency,
      Transaction,
      ExpenseItem,
      Expense,
    ]),
    AuthModule,
    UserModule,
    CustomerModule,
    CurrencyModule,
    BalanceModule,
    PrinterModule,
    TransactionModule,
    WalletModule,
    ExpenseItemModule,
    ExpenseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
