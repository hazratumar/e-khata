import { User } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transaction } from "src/transactions/entities/transaction.entity";
import { TransactionItem } from "src/transaction-items/entities/transaction-item.entity";

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rate: string;

  @OneToMany(
    () => TransactionItem,
    (transactionItem) => transactionItem.currency
  )
  transactionItem: TransactionItem[];

  @ManyToOne(() => User, (user) => user.currency, {
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

  constructor(partial: Partial<Currency>) {
    Object.assign(this, partial);
  }
}
