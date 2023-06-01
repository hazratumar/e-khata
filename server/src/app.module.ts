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
import { DownloadModule } from "./download/download.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ReportModule } from "./report/report.module";
import { DatabaseModule } from "./database/database.modules";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: "/assets",
      rootPath: join(__dirname, "assets"),
    }),
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    CustomerModule,
    CurrencyModule,
    BalanceModule,
    DownloadModule,
    TransactionModule,
    WalletModule,
    ExpenseItemModule,
    ExpenseModule,
    ReportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
