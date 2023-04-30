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
export class TransactionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @ManyToOne(() => Customer, (customer) => customer.from, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  from: Customer;

  @ManyToOne(() => Customer, (customer) => customer.to, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  to: Customer;

  @ManyToOne(() => Currency, (currency) => currency.transactionItem, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  currency: Currency;

  @Column()
  amount: string;

  @Column()
  rate: string;

  @Column()
  profit: string;

  @ManyToOne(() => Transaction, (transaction) => transaction.transactionItem, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  transaction: Transaction;

  @ManyToOne(() => User, (user) => user.transactionItem, {
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

  constructor(partial: Partial<TransactionItem>) {
    Object.assign(this, partial);
  }
}
