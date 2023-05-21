import { Module } from "@nestjs/common";

import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { WalletModule } from "src/wallets/wallet.module";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), WalletModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
