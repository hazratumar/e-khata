import { Injectable } from "@nestjs/common";
import { Brackets, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Wallet } from "./entities/wallet.entity";
import { UpdateWalletDto } from "./dto/update-wallet.dto";
import { CreateWalletDto } from "./dto/create-wallet.dto";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly usersService: UsersService
  ) { }

  async create(userId: number, customer: number, type: string, transaction: number): Promise<Wallet> {
    try {
      const user = await this.usersService.findOne(userId);

      const wallets = { customer, type, transaction, user };
      return this.walletRepository.save(wallets);
    } catch (error) {
      throw new Error(`Unable to create wallet: ${error.message}`);
    }
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

    const queryBuilder =
      this.walletRepository.createQueryBuilder("wallet");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("wallet.name ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("wallet.detail ILIKE :search", {
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

    const wallets = await queryBuilder
      .orderBy("wallet.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { wallets, total: length, page, totalPages };
  }

  async getByTransaction(id: number): Promise<Wallet[]> {
    return this.walletRepository.find({
      where: { transaction: { id } },
    });
  }

  async findOne(id: number): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    wallet: UpdateWalletDto
  ): Promise<Wallet> {
    const existingWallet = await this.findOne(id);

    // Merge the existing customer with the new data
    Object.assign(existingWallet, wallet);

    // Save the updated customer to the database
    return this.walletRepository.save(existingWallet);
  }

  remove(id: number) {
    return this.walletRepository.delete({ id });
  }
}
