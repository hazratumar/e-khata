import { Exclude } from "class-transformer";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: "Super Admin" | "Admin";

  @Column()
  status: "Pending" | "Active" | "Disable" | "Delete";

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  provider: "email" | "google";

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  otp: string;

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
}
