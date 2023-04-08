import { User } from 'src/users/entities/user.entity';
import { Currency } from 'src/currency/entities/currency.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.transactions, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(() => Currency, (currency) => currency.transactions, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    currency: Currency;

    @Column()
    amount: number;

    @Column()
    type: 'deposit' | 'withdrawal';

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    constructor(partial: Partial<Transaction>) {
        Object.assign(this, partial);
    }
}
