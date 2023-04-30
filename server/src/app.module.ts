import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { UserModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { CustomersModule } from "./customers/customers.module";
import { Customer } from "./customers/entities/customer.entity";
import { CurrencyModule } from "./currency/currency.module";
import { TransactionModule } from "./transactions/transactions.module";
import { Transaction } from "./transactions/entities/transaction.entity";
import { Currency } from "./currency/entities/currency.entity";
import { Expense } from "./expenses/entities/expense.entity";
import { ExpenseModule } from "./expenses/expense.module";
import { ExpenseItemModule } from "./expense-items/expense-item.module";
import { ExpenseItem } from "./expense-items/entities/expense-item.entity";
import { TransactionItem } from "./transaction-items/entities/transaction-item.entity";
import { TransactionItemModule } from "./transaction-items/transaction-item.module";

@Module({
  imports: [
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
        Transaction,
        TransactionItem,
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
    CustomersModule,
    CurrencyModule,
    TransactionModule,
    TransactionItemModule,
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
