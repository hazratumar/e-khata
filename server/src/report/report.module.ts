import { Module } from "@nestjs/common";

import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { WalletModule } from "src/wallets/wallet.module";
import { CustomerModule } from "src/customers/customers.module";
import { Customer } from "src/customers/entities/customer.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    CustomerModule,
    TypeOrmModule.forFeature([Wallet]),
    WalletModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
