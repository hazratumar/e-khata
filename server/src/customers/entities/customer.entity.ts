import { TransactionItem } from "src/transaction-items/entities/transaction-item.entity";
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

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  other: string;

  @Column({ default: false })
  isSelf: Boolean;

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.from)
  from: TransactionItem[];

  @OneToMany(() => TransactionItem, (transactionItem) => transactionItem.to)
  to: TransactionItem[];

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
