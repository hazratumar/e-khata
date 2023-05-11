import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";
import { Wallet } from "./entities/wallet.entity";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UserModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule { }
