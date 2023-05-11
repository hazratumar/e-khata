import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { UsersService } from "src/users/users.service";
import { CreateTransactionDto } from "./dto/create-Transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    transaction: CreateTransactionDto
  ): Promise<Transaction> {
    const user = await this.usersService.findOne(userId);
    const transactions = new Transaction({
      ...transaction,
      user,
    });
    return this.transactionRepository.save(transactions);
  }

  async update(
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const transaction = await this.findOne(updateTransactionDto.id);
    Object.assign(transaction, updateTransactionDto);
    await this.transactionRepository.save(transaction);
    return await this.findOne(updateTransactionDto.id);
  }

  async find(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where: {
          // your search query
        },
        take: limit,
        skip: skip,
        relations: ["user", "wallets"],
      }
    );

    const totalPages = Math.ceil(total / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    return { transactions, total, page, totalPages };
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
