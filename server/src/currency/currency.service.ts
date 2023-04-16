import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateCurrencyDto } from "./dto/create-currency.dto";
import { UpdateCurrencyDto } from "./dto/update-currency.dto";
import { Brackets, Repository } from "typeorm";
import { Currency } from "./entities/currency.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly usersService: UsersService
  ) {}

  async create(userId: number, currency: CreateCurrencyDto): Promise<Currency> {
    const user = await this.usersService.findOne(userId);
    const isDuplicateName = await this.findByName(currency.name);

    if (isDuplicateName) {
      throw new HttpException(
        "The currency name already exists.",
        HttpStatus.BAD_REQUEST
      );
    }

    const currencies = { ...currency, user };
    return this.currencyRepository.save(currencies);
  }

  async find(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    currencies: Currency[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder = this.currencyRepository.createQueryBuilder("currency");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("currency.name ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("currency.rate ILIKE :search", {
            search: `%${search}%`,
          });
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

    const currencies = await queryBuilder
      .orderBy("currency.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { currencies, total: length, page, totalPages };
  }

  async findOne(id: number): Promise<Currency> {
    return this.currencyRepository.findOne({ where: { id } });
  }
  async findByName(name: string): Promise<Currency> {
    return this.currencyRepository.findOne({ where: { name } });
  }

  async update(currency: UpdateCurrencyDto): Promise<Currency> {
    // Input validation
    if (!currency || Object.keys(currency).length === 0) {
      throw new HttpException("Invalid customer data", HttpStatus.BAD_REQUEST);
    }
    const existingCurrency = await this.findOne(currency.id);
    if (!existingCurrency) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
    const isDuplicateName = await this.findByName(currency.name);
    if (isDuplicateName && isDuplicateName.id !== currency.id) {
      throw new HttpException(
        "The Currency is presently available.",
        HttpStatus.BAD_REQUEST
      );
    }

    // Merge the existing customer with the new data
    Object.assign(existingCurrency, currency);

    // Save the updated customer to the database
    return this.currencyRepository.save(existingCurrency);
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
