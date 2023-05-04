import { Exclude } from "class-transformer";
import { Currency } from "src/currency/entities/currency.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Expense } from "src/expenses/entities/expense.entity";
import { ExpenseItem } from "src/expense-items/entities/expense-item.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { TransactionItem } from "src/transaction-items/entities/transaction-item.entity";

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: "Admin" })
  role: string;

  @Column({ default: "Pending" })
  status: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  otp: string;

  @OneToMany(() => Customer, (customer) => customer.user)
  customer: Customer[];

  @OneToMany(() => Currency, (currency) => currency.user)
  currency: Currency[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transaction: Transaction[];

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.user)
  transactionItem: TransactionItem[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expense: Expense[];

  @OneToMany(() => ExpenseItem, (expenseItem) => expenseItem.user)
  expenseItem: ExpenseItem[];

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

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
