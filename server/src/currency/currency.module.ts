import { Module } from "@nestjs/common";
import { CurrencyService } from "./currency.service";
import { CurrencyController } from "./currency.controller";
import { Currency } from "./entities/currency.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Currency]), UserModule],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
