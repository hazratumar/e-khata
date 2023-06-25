import { User } from "src/users/entities/user.entity";
import { Wallet } from "src/wallets/entities/wallet.entity";
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

  @OneToMany(() => Wallet, (wallet) => wallet.customer)
  wallets: Wallet[];

  @ManyToOne(() => User, (user) => user.customers, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: User;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date;

  constructor(partial: Partial<Customer>) {
    Object.assign(this, partial);
  }
}
