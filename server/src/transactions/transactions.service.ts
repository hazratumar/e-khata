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
import { CustomersService } from "src/customers/customers.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto
  ): Promise<Transaction> {
    try {
      const user = await this.usersService.findOne(userId);
      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        user,
      });
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      // Handle the error appropriately
      console.error("Error creating transaction:", error);
      throw new Error("Failed to create transaction");
    }
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

  async validateTransaction(
    creditCustomer: number,
    debitCustomer: number
  ): Promise<void> {
    const [creditor, debtor] = await Promise.all([
      this.customersService.findOne(creditCustomer),
      this.customersService.findOne(debitCustomer),
    ]);

    const isCreditorSelfCustomer = creditor.isSelf;
    const isDebtorSelfCustomer = debtor.isSelf;

    if (creditCustomer === debitCustomer) {
      throw new HttpException(
        "Credit and Debit customers are the same.",
        HttpStatus.BAD_REQUEST
      );
    }

    if (!isCreditorSelfCustomer && !isDebtorSelfCustomer) {
      throw new HttpException(
        "Select one self customer from the list.",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async find(): Promise<Transaction[]> {
    return this.transactionRepository.find();
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
