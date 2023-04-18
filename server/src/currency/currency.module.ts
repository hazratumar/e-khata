import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyController } from "./currency.controller";
import { Currency } from "./entities/currency.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), UsersModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrenciesModule {}
