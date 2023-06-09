import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Currency } from "src/currency/entities/currency.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { Repository } from "typeorm";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>
  ) {}

  async customerHistory(
    customerId: number,
    currencyId: number,
    startDate: Date,
    endDate: Date
  ) {
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const customerDetails = await this.customerRepository
      .createQueryBuilder("customer")
      .select(["customer.name AS name", "customer.address AS address"])
      .where("customer.id = :customerId", { customerId })
      .getRawOne();

    const currencyDetails = await this.currencyRepository
      .createQueryBuilder("currency")
      .select([
        "currency.name AS currency",
        "currency.abbreviation AS abbreviation",
      ])
      .where("currency.id = :currencyId", { currencyId })
      .getRawOne();

    let resultQueryBuilder = this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("wallet.from", "from")
      .leftJoin("transaction.currency", "currency")
      .leftJoin("transaction.exCurrency", "exCurrency")
      .select([
        "transaction.createdAt AS date",
        "customer.name AS customer",
        "from.name AS from",
        "wallet.type AS type",
        "currency.abbreviation AS currency",
        "transaction.amount AS amount",
        "exCurrency.abbreviation AS excurrency",
        "transaction.exRate AS exrate",
        "(transaction.amount * transaction.exRate) AS calculatedAmount",
      ])
      .where("transaction.createdAt >= :startDateTime", { startDateTime })
      .andWhere("transaction.createdAt <= :endDateTime", { endDateTime })
      .andWhere("wallet.type = :type", { type: "Credit" });

    if (customerId > 0) {
      resultQueryBuilder = resultQueryBuilder.andWhere(
        "customer.id = :customerId",
        { customerId }
      );
    }

    if (currencyId > 0) {
      resultQueryBuilder = resultQueryBuilder.andWhere(
        "currency.id = :currencyId",
        { currencyId }
      );
    }

    const result = await resultQueryBuilder
      .orderBy("transaction.createdAt", "ASC")
      .getRawMany();

    return {
      ...customerDetails,
      ...currencyDetails,
      startDate,
      endDate,
      result,
    };
  }

  async customerKhata(
    customerId: number,
    currencyId: number,
    startDate: Date,
    endDate: Date
  ) {
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    const customerDetails = await this.customerRepository
      .createQueryBuilder("customer")
      .select(["customer.name AS name", "customer.address AS address"])
      .where("customer.id = :customerId", { customerId })
      .getRawOne();

    const currency = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.exCurrency", "currency")
      .select([
        "currency.name AS currency",
        "currency.abbreviation AS abbreviation",
      ])
      .where("currency.id = :currencyId", { currencyId })
      .getRawOne();

    const result = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("wallet.from", "from")
      .leftJoin("transaction.currency", "currency")
      .leftJoin("transaction.exCurrency", "exCurrency")
      .select([
        "transaction.createdAt AS date",
        "customer.name AS customer",
        "from.name AS from",
        "wallet.type AS type",
        "currency.abbreviation AS currency",
        "transaction.amount AS amount",
        "exCurrency.abbreviation AS excurrency",
        "transaction.exRate AS exrate",
        "(transaction.amount * transaction.exRate) AS calculatedAmount",
      ])
      .where("customer.id = :customerId", { customerId })
      .andWhere("transaction.exCurrency = :currencyId", { currencyId })
      .andWhere("transaction.createdAt >= :startDateTime", { startDateTime })
      .andWhere("transaction.createdAt <= :endDateTime", { endDateTime })
      .orderBy("transaction.createdAt", "ASC")
      .getRawMany();

    const creditQuery = this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("transaction.currency", "currency")
      .select([
        "transaction.createdAt AS date",
        "wallet.type AS type",
        "transaction.exRate AS exrate",
        "transaction.amount AS amount",
      ])
      .where("customer.id = :customerId", { customerId })
      .andWhere("transaction.exCurrency = :currencyId", { currencyId })
      .andWhere("transaction.createdAt < :startDate", { startDate })
      .andWhere("wallet.type = :creditTypeName", { creditTypeName: "Credit" });

    const debitQuery = this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("transaction.currency", "currency")
      .select([
        "transaction.createdAt AS date",
        "wallet.type AS type",
        "transaction.exRate AS exrate",
        "transaction.amount AS amount",
      ])
      .where("customer.id = :customerId", { customerId })
      .andWhere("transaction.exCurrency = :currencyId", { currencyId })
      .andWhere("transaction.createdAt < :startDate", { startDate })
      .andWhere("wallet.type = :debitTypeName", { debitTypeName: "Debit" });

    const creditTransactions = await creditQuery.getRawMany();
    const debitTransactions = await debitQuery.getRawMany();

    const calculateOpeningBalance = (transactions) =>
      transactions.reduce(
        (total, { exrate, amount }) => total + amount * exrate,
        0
      );

    const openingBalanceCreditTotal =
      calculateOpeningBalance(creditTransactions);
    const openingBalanceDebitTotal = calculateOpeningBalance(debitTransactions);

    const openingBalance = openingBalanceCreditTotal - openingBalanceDebitTotal;

    return {
      ...customerDetails,
      ...currency,
      startDate,
      endDate,
      openingBalance,
      result,
    };
  }
}
