import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Wallet } from "./entities/wallet.entity";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { CreateWalletDto } from "./dto/create-wallet.dto";
import { TransactionsService } from "src/transactions/transactions.service";
import { CustomersService } from "src/customers/customers.service";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly transactionsService: TransactionsService,
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId: number,
    wallet: CreateWalletDto,
    transactionId: number
  ): Promise<Wallet> {
    const user = await this.usersService.findOne(userId);
    const transaction = await this.transactionsService.findOne(transactionId);

    const wallets = new Wallet({ ...wallet, user, transaction });
    return this.walletRepository.save(wallets);
  }

  async update(userId: number, wallet: UpdateWalletDto): Promise<Wallet> {
    const user = await this.usersService.findOne(userId);
    const customer = await this.customersService.findOne(wallet?.customer);
    const existingWallet = await this.findOne(wallet?.id);

    if (!existingWallet) {
      throw new NotFoundException(`Wallet with ID ${wallet?.id} not found`);
    }

    Object.assign(existingWallet, wallet, customer, user);

    return this.walletRepository.save(existingWallet);
  }

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async find(
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
      where: {
        // your search query
      },
      order: {
        updatedAt: "DESC",
      },
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

  async getByTransaction(id: number): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { transaction: { id } },
    });
  }

  async findOne(id: number): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.walletRepository.delete({ id });
  }
}
