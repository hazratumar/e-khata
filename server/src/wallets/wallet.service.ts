import { Injectable, NotFoundException } from "@nestjs/common";
import { FindManyOptions, In, IsNull, Not, Raw, Repository } from "typeorm";
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
    transactionId: number,
    from?: any
  ): Promise<Wallet> {
    try {
      const user = await this.usersService.findOne(userId);
      const transaction = await this.transactionsService.findOne(transactionId);

      const wallets = new Wallet({ ...wallet, user, transaction, from });
      return await this.walletRepository.save(wallets);
    } catch (error) {
      // Handle the error appropriately
      console.error("Error creating wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  async update(
    userId: number,
    wallet: UpdateWalletDto,
    from?: any
  ): Promise<Wallet> {
    try {
      const user = await this.usersService.findOne(userId);
      const customer = await this.customersService.findOne(wallet?.customer);
      const existingWallet = await this.findOne(wallet?.id);

      if (!existingWallet) {
        throw new NotFoundException(`Wallet with ID ${wallet?.id} not found`);
      }

      existingWallet.customer = customer;
      existingWallet.user = user;
      existingWallet.from = from;

      const updatedWallet = await this.walletRepository.save(existingWallet);
      return updatedWallet;
    } catch (error) {
      // Handle the error appropriately
      console.error("Error updating wallet:", error);
      throw new Error("Failed to update wallet");
    }
  }

  async findAll(): Promise<Wallet[]> {
    return this.walletRepository.find();
  }

  async transactionListing(
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

    const query: FindManyOptions<Wallet> = {
      where: {
        type: In(["Credit", "Debit"]),
        customer: {
          name: search
            ? Raw((alias) => `${alias} ILIKE '%${search}%'`)
            : Not(IsNull()),
        },
      },
      order: { updatedAt: "DESC" },
      take: limit,
      skip: skip,
      relations: ["user", "transaction"],
    };

    const [wallets, total] = await this.walletRepository.findAndCount(query);

    const totalPages = Math.ceil(total / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    return { wallets, total, page, totalPages };
  }

  async getByTransaction(id: number): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { transaction: { id } } });
  }

  async findOne(id: number): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.walletRepository.delete({ id });
  }
}
