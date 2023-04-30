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
import { TransactionItem } from "../dto/create-transaction-item.dto";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column({ type: "jsonb", default: {} })
  transaction: TransactionItem[];

  @ManyToOne(() => User, (user) => user.transaction, {
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
