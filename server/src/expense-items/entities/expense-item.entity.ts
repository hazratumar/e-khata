import { Expense } from "src/expenses/entities/expense.entity";
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
export class ExpenseItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("float")
  price: number;

  @Column()
  detail: string;

  @OneToMany(() => Expense, (expense) => expense.expenseItem)
  expense: Expense[];

  @ManyToOne(() => User, (user) => user.expenseItems, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  constructor(partial: Partial<ExpenseItem>) {
    Object.assign(this, partial);
  }
}
