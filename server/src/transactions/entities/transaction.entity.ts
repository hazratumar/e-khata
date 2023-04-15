import { Users } from "src/users/entities/user.entity";
import { Currencies } from "src/currency/entities/currency.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: Users;

  @ManyToOne(() => Currencies, (currency) => currency.transactions, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  currency: Currencies;

  @Column()
  amount: number;

  @Column()
  type: "deposit" | "withdrawal";

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

  constructor(partial: Partial<Transactions>) {
    Object.assign(this, partial);
  }
}
