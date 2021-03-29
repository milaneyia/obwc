import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Judging } from './judging/Judging';
import { Round } from './Round';
import { Team } from './Team';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalPath!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @Column()
    teamId!: number;

    @ManyToOne(() => Team, (team) => team.submissions, { nullable: false })
    team!: Team;

    @ManyToOne(() => Round, (round) => round.submissions, { nullable: false })
    round!: Round;

    @OneToMany(() => Judging, (judging) => judging.submission)
    judging!: Judging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
