import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from './Round';

@Entity()
export class Contest extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ default: false })
    isOpen!: boolean;

    @OneToMany(() => Round, (round) => round.contest)
    rounds!: Round[];

}
