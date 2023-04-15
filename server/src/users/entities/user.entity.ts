import { Exclude } from "class-transformer";
import { Currencies } from "src/currency/entities/currency.entity";
import { Customers } from "src/customers/entities/customer.entity";
import { Transactions } from "src/transactions/entities/transaction.entity";

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: "Admin" })
  role: "Super Admin" | "Admin";

  @Column({ default: "Pending" })
  status: "Pending" | "Active" | "Disable" | "Delete";

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  otp: string;

  @OneToMany(() => Customers, (customer) => customer.user)
  customers: Customers[];

  @OneToMany(() => Transactions, (transaction) => transaction.user)
  transactions: Transactions[];

  @OneToMany(() => Currencies, (currency) => currency.user)
  currency: Currencies[];

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

  constructor(partial: Partial<Users>) {
    Object.assign(this, partial);
  }
}
