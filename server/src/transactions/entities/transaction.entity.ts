import { User } from "src/users/entities/user.entity";
import { Currency } from "src/currency/entities/currency.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Wallet } from "src/wallets/entities/wallet.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Wallet, (wallet) => wallet.transaction)
  wallets: Wallet[];

  @ManyToOne(() => Currency, (currency) => currency.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  currency: Currency;

  @Column({ type: "float", default: 0 })
  amount: number;

  @ManyToOne(() => Currency, (currency) => currency.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  exCurrency?: Currency;
  @Column({ type: "float", default: 1 })
  exRate?: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial);
  }
}
