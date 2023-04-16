import { Credit } from "src/credits/entities/credit.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";
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

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  other: string;

  @OneToMany(() => Transaction, (transaction) => transaction.debitFrom)
  debitFrom: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.debitTo)
  debitTo: Transaction[];

  @OneToMany(() => Credit, (credit) => credit.creditFrom)
  creditFrom: Credit[];

  @OneToMany(() => Credit, (credit) => credit.creditTo)
  creditTo: Credit[];

  @ManyToOne(() => User, (user) => user.customer, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}