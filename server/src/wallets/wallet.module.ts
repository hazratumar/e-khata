import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/users/users.module";
import { Wallet } from "./entities/wallet.entity";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { TransactionModule } from "src/transactions/transactions.module";
import { CustomerModule } from "src/customers/customers.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    forwardRef(() => TransactionModule),
    CustomerModule,
    UserModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
