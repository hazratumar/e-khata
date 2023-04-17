import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { CustomersModule } from "./customers/customers.module";
import { Customer } from "./customers/entities/customer.entity";
import { CurrenciesModule } from "./currency/currency.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { Transaction } from "./transactions/entities/transaction.entity";
import { Currency } from "./currency/entities/currency.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "e-khata",
      entities: [User, Customer, Currency, Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Customer, Currency, Transaction]),
    AuthModule,
    UsersModule,
    CustomersModule,
    CurrenciesModule,
    TransactionsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
