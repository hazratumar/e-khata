import { Users } from "src/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Customers {
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

  @ManyToOne(() => Users, (user) => user.customers, {
    eager: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  user: Users;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  constructor(partial: Partial<Customers>) {
    Object.assign(this, partial);
  }
}
