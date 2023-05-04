import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateExpenseItemDto } from "./dto/create-expense-item.dto";
import { UpdateExpenseItemDto } from "./dto/update-expense-item.dto";
import { Brackets, Repository } from "typeorm";
import { ExpenseItem } from "./entities/expense-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";

@Injectable()
export class ExpenseItemService {
  constructor(
    @InjectRepository(ExpenseItem)
    private readonly expenseItemRepository: Repository<ExpenseItem>,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    expenseItem: CreateExpenseItemDto
  ): Promise<ExpenseItem> {
    const user = await this.usersService.findOne(userId);
    const isDuplicateName = await this.findByName(expenseItem.name);

    if (isDuplicateName) {
      throw new HttpException(
        "The expense item name already exists.",
        HttpStatus.BAD_REQUEST
      );
    }

    const expenseItems = { ...expenseItem, user };
    return this.expenseItemRepository.save(expenseItems);
  }

  async findAll(): Promise<ExpenseItem[]> {
    return this.expenseItemRepository.find();
  }

  async find(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    expenseItems: ExpenseItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder =
      this.expenseItemRepository.createQueryBuilder("expenseItem");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("expenseItem.name ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("expenseItem.detail ILIKE :search", {
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

    const expenseItems = await queryBuilder
      .orderBy("expenseItem.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { expenseItems, total: length, page, totalPages };
  }

  async findOne(id: number): Promise<ExpenseItem> {
    return this.expenseItemRepository.findOne({ where: { id } });
  }
  async findByName(name: string): Promise<ExpenseItem> {
    return this.expenseItemRepository.findOne({ where: { name } });
  }

  async update(
    id: number,
    expenseItem: UpdateExpenseItemDto
  ): Promise<ExpenseItem> {
    const existingExpenseItem = await this.findOne(id);

    // Merge the existing customer with the new data
    Object.assign(existingExpenseItem, expenseItem);

    // Save the updated customer to the database
    return this.expenseItemRepository.save(existingExpenseItem);
  }

  remove(id: number) {
    return `This action removes a #${id} expenseItem`;
  }
}
