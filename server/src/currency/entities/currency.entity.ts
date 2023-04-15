import { Users } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Transactions } from "src/transactions/entities/transaction.entity";

@Entity()
export class Currencies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  rate: string;

  @ManyToOne(() => Users, (user) => user.currency, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: Users;

  @OneToMany(() => Transactions, (transaction) => transaction.currency)
  transactions: Transactions[];

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

  constructor(partial: Partial<Currencies>) {
    Object.assign(this, partial);
  }
}
