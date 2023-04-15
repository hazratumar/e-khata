import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Transactions } from "./entities/transaction.entity";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto
  ): Promise<Transactions> {
    const transaction = this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async findAll(): Promise<Transactions[]> {
    return this.transactionRepository.find();
  }

  async findOne(id: number): Promise<Transactions> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transactions> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    const updatedTransaction = this.transactionRepository.merge(
      transaction,
      updateTransactionDto
    );
    return this.transactionRepository.save(updatedTransaction);
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }
}
