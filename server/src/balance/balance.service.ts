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
      where: { id: wallet.id },
    });

    if (!existingWallet) {
      throw new NotFoundException(`Wallet with ID ${wallet?.id} not found`);
    }

    Object.assign(existingWallet, wallet, customer, user);

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

  async getBalancesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<{
    credit: Array<{ abbreviation: string; amount: number }>;
    debit: Array<{ abbreviation: string; amount: number }>;
  }> {
    const endDateWithTime = new Date(endDate);
    endDateWithTime.setHours(23, 59, 59);
    const creditBalances = await this.getBalancesOfTypeByDateRange(
      "Credit",
      startDate,
      endDateWithTime
    );
    const debitBalances = await this.getBalancesOfTypeByDateRange(
      "Debit",
      startDate,
      endDateWithTime
    );

    const creditParsedBalances = this.parseBalances(creditBalances);
    const debitParsedBalances = this.parseBalances(debitBalances);

    const currencies = await this.currencyService.getCurrenciesAbbreviation();

    currencies.forEach((currency) => {
      if (
        !creditParsedBalances.find(
          (balance) => balance.abbreviation === currency
        )
      ) {
        creditParsedBalances.push({
          abbreviation: currency,
          amount: 0,
        });
      }
      if (
        !debitParsedBalances.find(
          (balance) => balance.abbreviation === currency
        )
      ) {
        debitParsedBalances.push({
          abbreviation: currency,
          amount: 0,
        });
      }
    });

    return {
      credit: creditParsedBalances,
      debit: debitParsedBalances,
    };
  }

  async getBalancesOfTypeByDateRange(
    type: string,
    startDate: Date,
    endDate: Date
  ) {
    return await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("wallet.customer", "customer")
      .where("customer.isSelf = :isSelf", { isSelf: true })
      .andWhere("transaction.createdAt >= :startDate", { startDate })
      .andWhere("transaction.createdAt <= :endDate", { endDate })
      .leftJoin("transaction.currency", "currency")
      .select("currency.name", "name")
      .addSelect("currency.abbreviation", "abbreviation")
      .addSelect(
        `SUM(CASE WHEN wallet.type = '${type}' THEN amount ELSE 0 END)`,
        "amount"
      )
      .groupBy("currency.name")
      .addGroupBy("currency.abbreviation")

      .getRawMany();
  }

  parseBalances(balances: Array<{ abbreviation: string; amount: string }>) {
    return balances.map((balance) => ({
      ...balance,
      amount: parseFloat(balance.amount),
    }));
  }
}
