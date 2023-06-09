import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { CustomersService } from "src/customers/customers.service";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { UpdateBalanceDto } from "./dto/update-balance.dto";
import { CurrencyService } from "src/currency/currency.service";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction) // Add this line
    private readonly transactionRepository: Repository<Transaction>,
    private readonly customersService: CustomersService,
    private readonly currencyService: CurrencyService,
    private readonly usersService: UsersService
  ) {}
  async balanceList(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    wallets: Wallet[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const [wallets, total] = await this.walletRepository.findAndCount({
      where: [{ type: "Deposit" }, { type: "Withdraw" }],
      order: { updatedAt: "DESC" },
      take: limit,
      skip: skip,
      relations: ["user", "transaction"],
    });

    const totalPages = Math.ceil(total / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    return { wallets, total, page, totalPages };
  }
  async updateBalance(
    userId: number,
    updateBalanceDto: UpdateBalanceDto
  ): Promise<Transaction> {
    try {
      const { id } = updateBalanceDto;
      const user = await this.usersService.findOne(userId);
      const balance = await this.transactionRepository.findOne({
        where: { id },
      });
      Object.assign(balance, updateBalanceDto, { user });
      await this.transactionRepository.save(balance);
      return balance;
    } catch (error) {
      // handle error
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async updateWallet(userId: number, wallet: UpdateWalletDto): Promise<Wallet> {
    const user = await this.usersService.findOne(userId);
    const customer = await this.customersService.findOne(wallet?.customer);
    const existingWallet = await this.walletRepository.findOne({
      where: { id: wallet?.id },
    });

    if (!existingWallet) {
      throw new NotFoundException(`Wallet with ID ${wallet.id} not found`);
    }

    existingWallet.user = user;
    existingWallet.customer = customer;
    Object.assign(existingWallet, wallet);

    return this.walletRepository.save(existingWallet);
  }

  async getBalancesByCurrency(): Promise<
    { name: string; abbreviation: string; amount: number }[]
  > {
    const balances = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .where("customer.isSelf = :isSelf", { isSelf: true })
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .select("currency.name", "name")
      .addSelect("currency.abbreviation", "abbreviation")
      .addSelect(
        "SUM(CASE WHEN wallet.type = 'Credit' THEN -transaction.amount WHEN wallet.type = 'Withdraw' THEN -transaction.amount ELSE transaction.amount END)",
        "amount"
      )
      .groupBy("currency.name")
      .addGroupBy("currency.abbreviation")
      .getRawMany();

    const balancesArray: {
      name: string;
      abbreviation: string;
      amount: number;
    }[] = balances.map(
      (balance: { name: string; abbreviation: string; amount: number }) => ({
        name: balance.name,
        abbreviation: balance.abbreviation,
        amount: balance.amount,
      })
    );

    return balancesArray;
  }

  async getBalancesByCustomer(): Promise<
    Record<string, Record<string, number>>
  > {
    const balances = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .where("customer.isSelf = :isSelf", { isSelf: true })
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .select("customer.name", "customer")
      .addSelect("currency.abbreviation", "currency")
      .addSelect(
        "SUM(CASE WHEN wallet.type = 'Credit' THEN -transaction.amount WHEN wallet.type = 'Withdraw' THEN -transaction.amount ELSE transaction.amount END)",
        "amount"
      )
      .groupBy("customer.name")
      .addGroupBy("currency.abbreviation")
      .getRawMany();

    const amountByCurrency: Record<string, Record<string, number>> = {};
    balances.forEach(
      (balance: { customer: string; currency: string; amount: string }) => {
        const customer = balance.customer;
        const currency = balance.currency;
        const amount = parseFloat(balance.amount);

        if (!amountByCurrency[customer]) {
          amountByCurrency[customer] = {};
        }

        amountByCurrency[customer][currency] = amount;
      }
    );

    return amountByCurrency;
  }

  async getDataByDateRange(startDate: Date, endDate: Date) {
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);
    const creditQuery = this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .leftJoin("transaction.exCurrency", "exCurrency")
      .select([
        "currency.abbreviation AS currency",
        "exCurrency.abbreviation AS exCurrency",
        "SUM(transaction.amount) AS credit",
        "SUM(transaction.exRate * transaction.amount) AS debit",
      ])
      .where("transaction.createdAt >= :startDateTime", { startDateTime })
      .andWhere("transaction.createdAt <= :endDateTime", { endDateTime })
      .andWhere("wallet.type = :type", { type: "Credit" })
      .andWhere("customer.isSelf = :isSelf", { isSelf: true })
      .groupBy("currency.abbreviation, exCurrency.abbreviation");

    const debitQuery = this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .leftJoin("transaction.exCurrency", "exCurrency")
      .select([
        "currency.abbreviation AS currency",
        "exCurrency.abbreviation AS exCurrency",
        "SUM(transaction.amount) AS debit",
        "SUM(transaction.exRate * transaction.amount) AS credit",
      ])
      .where("transaction.createdAt >= :startDateTime", { startDateTime })
      .andWhere("transaction.createdAt <= :endDateTime", { endDateTime })
      .andWhere("wallet.type = :type", { type: "Debit" })
      .andWhere("customer.isSelf = :isSelf", { isSelf: true })
      .groupBy("currency.abbreviation, exCurrency.abbreviation");

    const [creditResults, debitResults] = await Promise.all([
      creditQuery.getRawMany(),
      debitQuery.getRawMany(),
    ]);

    const formattedResults = {
      credits: {
        credit: [],
        debit: [],
      },
      debits: {
        debit: [],
        credit: [],
      },
    };

    // Sum credit amounts for the same currency or excurrency
    creditResults.forEach((result) => {
      const existingCredit = formattedResults.credits.credit.find(
        (credit) => credit.currency === result.currency
      );
      if (existingCredit) {
        existingCredit.amount += -1 * result.credit; // Multiply with -1 to make it negative
      } else {
        formattedResults.credits.credit.push({
          currency: result.currency,
          amount: -1 * result.credit, // Multiply with -1 to make it negative
        });
      }

      const existingDebit = formattedResults.credits.debit.find(
        (debit) => debit.excurrency === result.excurrency
      );
      if (existingDebit) {
        existingDebit.amount += result.debit;
      } else {
        formattedResults.credits.debit.push({
          excurrency: result.excurrency,
          amount: result.debit,
        });
      }
    });

    // Sum debit amounts for the same currency or excurrency
    debitResults.forEach((result) => {
      const existingDebit = formattedResults.debits.debit.find(
        (debit) => debit.currency === result.currency
      );
      if (existingDebit) {
        existingDebit.amount += result.debit;
      } else {
        formattedResults.debits.debit.push({
          currency: result.currency,
          amount: result.debit,
        });
      }

      const existingCredit = formattedResults.debits.credit.find(
        (credit) => credit.excurrency === result.excurrency
      );
      if (existingCredit) {
        existingCredit.amount = -1 * result.credit;
      } else {
        formattedResults.debits.credit.push({
          excurrency: result.excurrency,
          amount: -1 * result.credit,
        });
      }
    });

    const result = {
      credits: [],
      debits: [],
      stocks: [],
    };

    formattedResults.credits.credit.forEach((credit) => {
      const existingDebit = formattedResults.debits.debit.find(
        (debit) => debit.currency === credit.currency
      );

      if (existingDebit) {
        result.debits.push({
          currency: credit.currency,
          amount: existingDebit.amount + credit.amount,
        });
      } else {
        result.debits.push({
          currency: credit.currency,
          amount: credit.amount,
        });
      }
    });

    formattedResults.credits.debit.forEach((debit) => {
      const existingCredit = formattedResults.debits.credit.find(
        (credit) => credit.excurrency === debit.excurrency
      );

      if (existingCredit) {
        result.credits.push({
          currency: debit.excurrency,
          amount: existingCredit.amount + debit.amount,
        });
      } else {
        result.credits.push({
          currency: debit.excurrency,
          amount: debit.amount,
        });
      }
    });

    formattedResults.debits.credit.forEach((credit) => {
      const existingCredit = formattedResults.credits.debit.find(
        (debit) => debit.excurrency === credit.excurrency
      );

      if (!existingCredit) {
        result.credits.push({
          currency: credit.excurrency,
          amount: credit.amount,
        });
      }
    });

    formattedResults.debits.debit.forEach((debit) => {
      const existingDebit = formattedResults.debits.credit.find(
        (credit) => credit.currency === debit.currency
      );

      if (!existingDebit) {
        result.debits.push({
          currency: debit.currency,
          amount: debit.amount,
        });
      }
    });

    // Assign the updated result.credits and result.debits back to the result object
    result.credits = result.credits.sort((a, b) =>
      a.currency.localeCompare(b.currency)
    );
    result.debits = result.debits.sort((a, b) =>
      a.currency.localeCompare(b.currency)
    );

    const stocks = await this.getSelfCustomersStock(endDateTime);
    result.stocks.push(...stocks);
    return result;
  }

  // async getDataByDateRange(startDate, endDate) {
  //   const creditBalances = await this.getBalancesOfTypeByDateRange(
  //     "Credit",
  //     startDate,
  //     endDate
  //   );
  //   const debitBalances = await this.getBalancesOfTypeByDateRange(
  //     "Debit",
  //     startDate,
  //     endDate
  //   );

  //   const creditParsedBalances = this.parseBalances(creditBalances);
  //   const debitParsedBalances = this.parseBalances(debitBalances);

  //   const currencies = await this.currencyService.getCurrenciesAbbreviation();

  //   const endDateWithTime = new Date(endDate);
  //   endDateWithTime.setHours(23, 59, 59);

  //   // Execute both credit and debit queries concurrently
  //   const [creditResult, debitResult] = await Promise.all([
  //     this.walletRepository
  //       .createQueryBuilder("wallet")
  //       .leftJoin("wallet.customer", "customer")
  //       .leftJoin("wallet.transaction", "transaction")
  //       .leftJoin("transaction.currency", "currency")
  //       .leftJoin("transaction.exCurrency", "exCurrency")
  //       .where("transaction.createdAt >= :startDate", { startDate })
  //       .andWhere("transaction.createdAt <= :endDate", {
  //         endDate: endDateWithTime,
  //       })
  //       .andWhere("wallet.type = :type", { type: "Credit" })
  //       .andWhere("customer.isSelf = :isSelf", { isSelf: true })
  //       .select("currency.abbreviation", "currency")
  //       .addSelect("exCurrency.abbreviation", "exCurrency")
  //       .addSelect("SUM(transaction.amount)", "credit")
  //       .addSelect("SUM(transaction.exRate * transaction.amount)", "debit")
  //       .groupBy("currency.abbreviation, exCurrency.abbreviation")
  //       .getRawMany(),

  //     this.walletRepository
  //       .createQueryBuilder("wallet")
  //       .leftJoin("wallet.customer", "customer")
  //       .leftJoin("wallet.transaction", "transaction")
  //       .leftJoin("transaction.currency", "currency")
  //       .leftJoin("transaction.exCurrency", "exCurrency")
  //       .where("transaction.createdAt >= :startDate", { startDate })
  //       .andWhere("transaction.createdAt <= :endDate", {
  //         endDate: endDateWithTime,
  //       })
  //       .andWhere("wallet.type = :type", { type: "Debit" })
  //       .andWhere("customer.isSelf = :isSelf", { isSelf: true })
  //       .select("currency.abbreviation", "currency")
  //       .addSelect("exCurrency.abbreviation", "exCurrency")
  //       .addSelect("SUM(transaction.amount)", "debit")
  //       .addSelect("SUM(transaction.exRate * transaction.amount)", "credit")
  //       .groupBy("currency.abbreviation, exCurrency.abbreviation")
  //       .getRawMany(),
  //   ]);

  //   const sumOfCredits = {};
  //   const sumOfDebits = {};

  //   currencies.forEach((currency) => {
  //     sumOfCredits[currency] = 0;
  //     sumOfDebits[currency] = 0;
  //   });

  //   creditResult.forEach((result) => {
  //     const currency = result.currency;
  //     const exCurrency = result.exCurrency;
  //     const credit = parseFloat(result.credit) || 0;
  //     const debit = parseFloat(result.debit) || 0;

  //     sumOfCredits[currency] += credit;
  //     sumOfDebits[exCurrency] += debit;
  //   });

  //   debitResult.forEach((result) => {
  //     const currency = result.currency;
  //     const exCurrency = result.exCurrency;
  //     const credit = parseFloat(result.credit) || 0;
  //     const debit = parseFloat(result.debit) || 0;

  //     sumOfCredits[exCurrency] += credit;
  //     sumOfDebits[currency] += debit;
  //   });

  //   // Update creditParsedBalances and debitParsedBalances with missing currencies
  //   currencies.forEach((currency) => {
  //     if (
  //       !creditParsedBalances.find(
  //         (balance) => balance.abbreviation === currency
  //       )
  //     ) {
  //       creditParsedBalances.push({
  //         abbreviation: currency,
  //         amount: 0,
  //       });
  //     }
  //     if (
  //       !debitParsedBalances.find(
  //         (balance) => balance.abbreviation === currency
  //       )
  //     ) {
  //       debitParsedBalances.push({
  //         abbreviation: currency,
  //         amount: 0,
  //       });
  //     }
  //   });

  //   return {
  //     credit: creditParsedBalances,
  //     debit: debitParsedBalances,
  //     sumOfCredits,
  //     sumOfDebits,
  //   };
  // }

  // async getBalancesOfTypeByDateRange(
  //   type: string,
  //   startDate: Date,
  //   endDate: Date
  // ) {
  //   const endDateWithTime = new Date(endDate);
  //   endDateWithTime.setHours(23, 59, 59);
  //   return await this.walletRepository
  //     .createQueryBuilder("wallet")
  //     .leftJoin("wallet.transaction", "transaction")
  //     .leftJoin("wallet.customer", "customer")
  //     .where("customer.isSelf = :isSelf", { isSelf: true })
  //     .andWhere("transaction.createdAt >= :startDate", { startDate })
  //     .andWhere("transaction.createdAt <= :endDate", {
  //       endDate: endDateWithTime,
  //     })
  //     .leftJoin("transaction.currency", "currency")
  //     .select("currency.name", "name")
  //     .addSelect("currency.abbreviation", "abbreviation")
  //     .addSelect(
  //       `SUM(CASE WHEN wallet.type = '${type}' THEN amount ELSE 0 END)`,
  //       "amount"
  //     )
  //     .groupBy("currency.name")
  //     .addGroupBy("currency.abbreviation")

  //     .getRawMany();
  // }
  // parseBalances(balances: Array<{ abbreviation: string; amount: string }>) {
  //   return balances.map((balance) => ({
  //     ...balance,
  //     amount: parseFloat(balance.amount),
  //   }));
  // }

  async getSelfCustomersStock(
    date: Date
  ): Promise<{ currency: string; stock: number }[]> {
    const stock = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .where("customer.isSelf = :isSelf", { isSelf: true })
      .andWhere("transaction.createdAt <= :date", { date })
      .select("currency.abbreviation", "currency")
      .addSelect(
        "SUM(CASE WHEN wallet.type = 'Credit' THEN -transaction.amount WHEN wallet.type = 'Withdraw' THEN -transaction.amount ELSE transaction.amount END)",
        "amount"
      )
      .groupBy("currency.abbreviation")
      .getRawMany();

    const stockByCurrency: Record<string, number> = {};
    stock.forEach((balance: { currency: string; amount: string }) => {
      const currency = balance.currency;
      const amount = parseFloat(balance.amount);

      stockByCurrency[currency] = amount;
    });

    const currencies = await this.currencyService.getCurrenciesAbbreviation();

    const stockForDate: { currency: string; stock: number }[] = [];
    currencies.forEach((currency: string) => {
      const stockValue = stockByCurrency[currency] || 0;
      stockForDate.push({ currency, stock: stockValue });
    });

    return stockForDate;
  }
}
