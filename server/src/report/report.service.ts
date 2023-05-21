import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) {}

  async customerReport(
    customer: number,
    currency: number,
    startDate: Date,
    endDate: Date
  ) {
    const result = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("transaction.currency", "currency")
      .leftJoin("transaction.exCurrency", "exCurrency")
      .select([
        "transaction.createdAt",
        "customer.name",
        "currency.abbreviation",
        "transaction.amount",
        "exCurrency.name",
        "transaction.exRate",
      ])
      .where("customer.id = :customerId", { customerId: customer })
      .andWhere("transaction.createdAt >= :startDate", { startDate })
      .andWhere("transaction.createdAt <= :endDate", { endDate })
      .andWhere("currency.id = :currencyId", { currencyId: currency })
      .getRawMany();

    return result;
  }
}
