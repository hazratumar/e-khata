import { User } from 'src/users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { IsString, IsOptional, IsPhoneNumber, Length } from 'class-validator';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @Length(2, 100)
    name: string;

    @Column()
    @IsString()
    @Length(2, 50)
    nickname: string;

    @Column()
    @IsPhoneNumber('IN')
    phone: string;

    @Column()
    @IsString()
    @Length(5, 200)
    address: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    @Length(0, 200)
    other?: string;

    @ManyToOne(() => User, (user) => user.customers, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    constructor(partial: Partial<Customer>) {
        Object.assign(this, partial);
    }
}
