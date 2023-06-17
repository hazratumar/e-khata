import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
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

    // validate input here if desired

    const newCurrency = new Currency({ ...currency, user });
    try {
      return await this.currencyRepository.save(newCurrency);
    } catch (error) {
      if (error.code === "23505") {
        // check if the error is a duplicate key error
        const columnName = error.detail.match(/\((.*?)\)/)[1]; // extract the column name from the error detail
        throw new ConflictException(
          `Currency with this ${columnName} already exists`
        );
      }
      throw error;
    }
  }

  async getOptions(): Promise<{ id: number; abbreviation: string }[]> {
    const query = await this.currencyRepository
      .createQueryBuilder("currency")
      .select("currency.id", "id")
      .addSelect("currency.name", "name")
      .addSelect("currency.abbreviation", "abbreviation");

    return query.getRawMany();
  }
  async getCurrenciesAbbreviation(): Promise<string[]> {
    const query = await this.currencyRepository
      .createQueryBuilder("currency")
      .select("currency.abbreviation", "abbreviation");

    const results = await query.getRawMany();
    const abbreviations = results.map((result) => result.abbreviation);

    return abbreviations;
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

  async update(id: number, currency: UpdateCurrencyDto): Promise<Currency> {
    const existingCurrency = await this.findOne(id);
    if (!existingCurrency) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }

    // Merge the existing customer with the new data
    const updatedCurrency = this.currencyRepository.merge(
      existingCurrency,
      currency
    );

    try {
      // Save the updated customer to the database
      return this.currencyRepository.save(updatedCurrency);
    } catch (error) {
      if (error.code === "23505") {
        // check if the error is a duplicate key error
        const columnName = error.detail.match(/\((.*?)\)/)[1]; // extract the column name from the error detail
        throw new ConflictException(
          `Currency with this ${columnName} already exists`
        );
      }
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
