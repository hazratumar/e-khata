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
    customerId: number,
    currencyId: number,
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
        "wallet.type",
        "currency.abbreviation",
        "transaction.amount",
        "exCurrency.abbreviation",
        "transaction.exRate",
      ])
      .where("customer.id = :customerId", { customerId })
      .andWhere("transaction.exCurrency = :currencyId", { currencyId })
      .andWhere("transaction.createdAt >= :startDate", { startDate })
      .andWhere("transaction.createdAt <= :endDate", { endDate })
      .getRawMany();

    return result;
  }
}
