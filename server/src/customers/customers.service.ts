import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer";
import { UsersService } from "src/users/users.service";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { CurrencyService } from "src/currency/currency.service";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly currencyService: CurrencyService,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    createCustomerDto: CreateCustomerDto
  ): Promise<Customer> {
    const user = await this.usersService.findOne(userId);

    const customer = new Customer({
      ...createCustomerDto,
      user,
    });

    try {
      return await this.customerRepository.save(customer);
    } catch (error) {
      if (error.code === "23505") {
        // check if the error is a duplicate key error
        const columnName = error.detail.match(/\((.*?)\)/)[1]; // extract the column name from the error detail
        throw new ConflictException(
          `Customer with this ${columnName} already exists`
        );
      }
      throw error;
    }
  }

  async getOptions(): Promise<{ id: number; name: string }[]> {
    const query = await this.customerRepository
      .createQueryBuilder("customer")
      .select("customer.id", "id")
      .addSelect("customer.name", "name");

    return query.getRawMany();
  }

  async getBalanceOptions(): Promise<{ id: number; name: string }[]> {
    const query = await this.customerRepository
      .createQueryBuilder("customer")
      .select("customer.id", "id")
      .addSelect("customer.name", "name")
      .where("customer.isSelf = true");

    return query.getRawMany();
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder = this.customerRepository.createQueryBuilder("customer");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("customer.name ILIKE :search", { search: `%${search}%` })
            .orWhere("customer.nickname ILIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("customer.phone ILIKE :search", { search: `%${search}%` })
            .orWhere("customer.address ILIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("customer.other ILIKE :search", { search: `%${search}%` });
        })
      );
    }

    const length = await queryBuilder.getCount();

    const totalPages = Math.ceil(length / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    const customers = await queryBuilder
      .orderBy("customer.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { customers, total: length, page, totalPages };
  }

  async customerDetail(id: number) {
    const customer = await this.findOne(id);
    const stock = await this.getCustomerStock(id);

    return { ...customer, stock };
  }

  async findOne(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
  }
  async findByName(name: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { name } });
  }
  async findByNickname(nickname: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { nickname } });
  }

  async update(id: number, customer: UpdateCustomerDto): Promise<Customer> {
    // Check if customer with given ID exists
    const existingCustomer = await this.findOne(id);
    if (!existingCustomer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }

    // Merge the existing customer with the new data
    const updatedCustomer = this.customerRepository.merge(
      existingCustomer,
      customer
    );

    try {
      // Save the updated customer to the database
      return await this.customerRepository.save(updatedCustomer);
    } catch (error) {
      if (error.code === "23505") {
        // check if the error is a duplicate key error
        const columnName = error.detail.match(/\((.*?)\)/)[1]; // extract the column name from the error detail
        throw new ConflictException(
          `Customer with this ${columnName} already exists`
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    // Delete the costumer from the database
    const result = await this.customerRepository.delete({ id });
    // If no costumer was affected (i.e. the costumer doesn't exist), throw an error
    if (result.affected === 0) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
  }

  async getCustomerStock(
    id: number
  ): Promise<{ currency: string; stock: number }[]> {
    const stock = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoin("wallet.customer", "customer")
      .where("customer.id = :id", { id })
      .leftJoin("wallet.transaction", "transaction")
      .leftJoin("transaction.currency", "currency")
      .select("currency.abbreviation", "currency")
      .addSelect(
        "SUM(CASE WHEN wallet.type = 'Credit' THEN -transaction.amount WHEN wallet.type = 'Withdraw' THEN -transaction.amount ELSE transaction.amount END)",
        "amount"
      )
      .groupBy("currency.abbreviation")
      .getRawMany();

    const amountByCurrency: Record<string, number> = {};
    stock.forEach((balance: { currency: string; amount: string }) => {
      const currency = balance.currency;
      const amount = parseFloat(balance.amount);

      amountByCurrency[currency] = amount;
    });

    const currencies = await this.currencyService.getCurrenciesAbbreviation();

    const allCurrenciesStock: { currency: string; stock: number }[] = [];
    currencies.forEach((currency: string) => {
      const stockValue = amountByCurrency[currency] || 0;
      allCurrenciesStock.push({ currency, stock: stockValue });
    });

    return allCurrenciesStock;
  }

  async customerKhata(id: number): Promise<{ id: number; currency: string }[]> {
    const currencies = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.customer", "customer")
      .leftJoinAndSelect("wallet.transaction", "transaction")
      .leftJoinAndSelect("transaction.exCurrency", "exCurrency")
      .select("exCurrency.id", "id")
      .addSelect("exCurrency.abbreviation", "abbreviation")
      .where("customer.id = :id", { id })
      .andWhere("transaction.exCurrency IS NOT NULL")
      .groupBy("exCurrency.id, exCurrency.abbreviation")
      .getRawMany();

    return currencies;
  }
}
