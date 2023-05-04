import { Injectable } from "@nestjs/common";
import { Brackets, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { TransactionItem } from "src/transaction-items/entities/transaction-item.entity";
import { CreateTransactionItemDto } from "./dto/create-transaction-item.dto";
import { UpdateTransactionItemDto } from "./dto/update-transaction-item.dto";

@Injectable()
export class TransactionItemService {
  constructor(
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    private readonly usersService: UsersService
  ) {}

  async create(userId: number, transactionItem: any): Promise<TransactionItem> {
    const user = await this.usersService.findOne(userId);

    const transactionItems = { ...transactionItem, user };
    return this.transactionItemRepository.save(transactionItems);
  }

  async findAll(): Promise<TransactionItem[]> {
    return this.transactionItemRepository.find();
  }

  async find(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    transactionItems: TransactionItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder =
      this.transactionItemRepository.createQueryBuilder("transactionItem");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("transactionItem.name ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("transactionItem.detail ILIKE :search", {
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

    const transactionItems = await queryBuilder
      .orderBy("transactionItem.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { transactionItems, total: length, page, totalPages };
  }

  async getByTransaction(id: number): Promise<TransactionItem[]> {
    return this.transactionItemRepository.find({
      where: { transaction: { id } },
    });
  }

  async findOne(id: number): Promise<TransactionItem> {
    return this.transactionItemRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    transactionItem: UpdateTransactionItemDto
  ): Promise<TransactionItem> {
    const existingTransactionItem = await this.findOne(id);

    // Merge the existing customer with the new data
    Object.assign(existingTransactionItem, transactionItem);

    // Save the updated customer to the database
    return this.transactionItemRepository.save(existingTransactionItem);
  }

  remove(id: number) {
    return this.transactionItemRepository.delete({ id });
  }
}
