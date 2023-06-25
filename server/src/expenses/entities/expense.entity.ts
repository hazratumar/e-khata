import { ExpenseItem } from "src/expense-items/entities/expense-item.entity";
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
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  price: number;

  @Column("float")
  quantity: number;

  @Column()
  detail: string;

  @OneToMany(() => ExpenseItem, (expenseItem) => expenseItem.expense)
  expenseItem: ExpenseItem[];

  @ManyToOne(() => User, (user) => user.expenses, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  constructor(partial: Partial<Expense>) {
    Object.assign(this, partial);
  }
}
