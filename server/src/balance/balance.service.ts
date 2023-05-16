import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { TransactionsService } from "src/transactions/transactions.service";
import { CustomersService } from "src/customers/customers.service";
import { Wallet } from "src/wallets/entities/wallet.entity";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { UpdateBalanceDto } from "./dto/update-balance.dto";

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction) // Add this line
    private readonly transactionRepository: Repository<Transaction>,
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService
  ) {}
  async balanceList(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    wallets: Wallet[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const [wallets, total] = await this.walletRepository.findAndCount({
      where: [{ type: "Deposit" }, { type: "Withdraw" }],
      order: { updatedAt: "DESC" },
      take: limit,
      skip: skip,
      relations: ["user", "transaction"],
    });

    const totalPages = Math.ceil(total / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    return { wallets, total, page, totalPages };
  }
  async updateBalance(
    userId: number,
    updateBalanceDto: UpdateBalanceDto
  ): Promise<Transaction> {
    try {
      const { id } = updateBalanceDto;
      const user = await this.usersService.findOne(userId);
      const balance = await this.transactionRepository.findOne({
        where: { id },
      });
      Object.assign(balance, updateBalanceDto, { user });
      await this.transactionRepository.save(balance);
      return balance;
    } catch (error) {
      // handle error
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async updateWallet(userId: number, wallet: UpdateWalletDto): Promise<Wallet> {
    const user = await this.usersService.findOne(userId);
    const customer = await this.customersService.findOne(wallet?.customer);
    const existingWallet = await this.walletRepository.findOne({
      where: { id: wallet.id },
    });

    if (!existingWallet) {
      throw new NotFoundException(`Wallet with ID ${wallet?.id} not found`);
    }

    Object.assign(existingWallet, wallet, customer, user);

    return this.walletRepository.save(existingWallet);
  }
}
