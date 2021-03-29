import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Round } from './Round';


@Entity()
export class Song extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    title!: string;

    @Column()
    link!: string;

    @Column()
    roundId!: number;

    @ManyToOne(() => Round, (round) => round.songs, { nullable: false })
    round!: Round;

}
