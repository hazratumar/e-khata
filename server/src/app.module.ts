import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { AtGuard } from "./common/guards";
import { UsersModule } from "./users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "./users/entities/user.entity";
import { CustomersModule } from "./customers/customers.module";
import { Customers } from "./customers/entities/customer.entity";
import { CurrencyModule } from "./currency/currency.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { Transactions } from "./transactions/entities/transaction.entity";
import { Currencies } from "./currency/entities/currency.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "1234",
      database: "e-khata",
      entities: [Users, Customers, Currencies, Transactions],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users, Customers, Currencies, Transactions]),
    AuthModule,
    UsersModule,
    CustomersModule,
    CurrencyModule,
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
