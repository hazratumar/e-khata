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

  @Column()
  amount: string;

  @ManyToOne(() => Currency, (currency) => currency.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  exCurrency?: Currency;

  @Column({ default: "1" })
  exRate?: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial);
  }
}
