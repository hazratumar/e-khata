import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
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
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    const user = await this.usersService.findOne(userId);
    const transactions = new Transaction({
      ...createTransactionDto,
      user,
    });
    return this.transactionRepository.save(transactions);
  }

  async update(
    userId: number,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    try {
      const { id } = updateTransactionDto;
      const user = await this.usersService.findOne(userId);
      const transaction = await this.findOne(id);
      Object.assign(transaction, updateTransactionDto, { user });
      await this.transactionRepository.save(transaction);
      return transaction;
    } catch (error) {
      // handle error
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async validation(
    creditCustomer: number,
    debitCustomer: number,
    currency: number,
    exCurrency: number
  ) {
    if (creditCustomer === debitCustomer || currency === exCurrency) {
      const errorMessage =
        creditCustomer === debitCustomer
          ? "Credit and Debit customers are the same."
          : "Currency and Exchange Currency are the same.";
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
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
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
        relations: ["wallets"],
      });
      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
