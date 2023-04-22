import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { Brackets, Repository } from "typeorm";
import { Expense } from "./entities/expense.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    expenseItem: CreateExpenseDto
  ): Promise<Expense> {
    const user = await this.usersService.findOne(userId);

    const currencies = { ...expenseItem, user };
    return this.expenseRepository.save(currencies);
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  async find(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    currencies: Expense[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder =
      this.expenseRepository.createQueryBuilder("expenseItem");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("expenseItem.name ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("expenseItem.rate ILIKE :search", {
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
      .orderBy("expenseItem.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { currencies, total: length, page, totalPages };
  }

  async findOne(id: number): Promise<Expense> {
    return this.expenseRepository.findOne({ where: { id } });
  }

  async update(id: number, expenseItem: UpdateExpenseDto): Promise<Expense> {
    // Input validation
    if (!expenseItem || Object.keys(expenseItem).length === 0) {
      throw new HttpException("Invalid customer data", HttpStatus.BAD_REQUEST);
    }
    const existingExpense = await this.findOne(id);

    // Merge the existing customer with the new data
    Object.assign(existingExpense, expenseItem);

    // Save the updated customer to the database
    return this.expenseRepository.save(existingExpense);
  }

  remove(id: number) {
    return `This action removes a #${id} expenseItem`;
  }
}
