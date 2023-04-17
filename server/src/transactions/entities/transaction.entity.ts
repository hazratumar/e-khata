import { User } from "src/users/entities/user.entity";
import { Currency } from "src/currency/entities/currency.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "src/customers/entities/customer.entity";
import { Credits } from "../dto/create-credits.dto";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.debitFrom, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  debitFrom: Customer;

  @ManyToOne(() => Customer, (customer) => customer.debitTo, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  debitTo: Customer;

  @ManyToOne(() => Currency, (currency) => currency.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  currency: Currency;

  @Column()
  amount: number;

  @Column()
  rate: number;

  @Column()
  profit: number;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.transaction, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ type: "jsonb", default: {} })
  credits: Credits[];

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
