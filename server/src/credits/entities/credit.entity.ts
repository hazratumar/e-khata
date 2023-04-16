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
import { Customer } from "src/customers/entities/customer.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";

@Entity()
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.creditFrom, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  creditFrom: Customer;

  @ManyToOne(() => Customer, (customer) => customer.creditTo, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  creditTo: Customer;

  @ManyToOne(() => Currency, (currency) => currency.credit, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  currency: Currency;

  @Column()
  amount: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.credit, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  transaction: Transaction;

  @ManyToOne(() => User, (user) => user.credit, {
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
