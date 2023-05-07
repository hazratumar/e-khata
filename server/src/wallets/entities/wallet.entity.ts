import { Currency } from "src/currency/entities/currency.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.wallets, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  customer: Customer;

  @ManyToOne(() => Transaction, (transaction) => transaction.wallets, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  transaction: Transaction;

  @ManyToOne(() => User, (user) => user.wallets, {
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

  constructor(partial: Partial<Wallet>) {
    Object.assign(this, partial);
  }
}
