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

  @Column({ unique: true })
  name: string;

  @Column("float")
  rate: number;

  @Column({ unique: true })
  abbreviation: string;

  @OneToMany(() => Transaction, (transaction) => transaction.currency)
  transactions: Transaction[];

  @ManyToOne(() => User, (user) => user.currencies, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  constructor(partial: Partial<Currency>) {
    Object.assign(this, partial);
  }
}
