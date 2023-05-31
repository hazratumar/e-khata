import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Currency } from "src/currency/entities/currency.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { ExpenseItem } from "src/expense-items/entities/expense-item.entity";
import { Expense } from "src/expenses/entities/expense.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import { Wallet } from "src/wallets/entities/wallet.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("postgres.host"),
        port: configService.get<number>("postgres.port"),
        username: configService.get<string>("postgres.username"),
        password: configService.get<string>("postgres.password"),
        database: configService.get<string>("postgres.database"),
        synchronize: true,
        entities: [
          User,
          Customer,
          Currency,
          Wallet,
          Transaction,
          ExpenseItem,
          Expense,
        ],
        ssl: configService.get<string>("postgres.certificate") && {
          ca: Buffer.from(
            configService.get<string>("postgres.certificate"),
            "base64"
          ).toString("ascii"),
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
