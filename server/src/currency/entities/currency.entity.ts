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

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rate: string;

  @ManyToOne(() => User, (user) => user.currency, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.currency)
  transactions: Transaction[];

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
