import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JudgeToRound } from './judging/JudgeToRound';
import { Song } from './Song';
import { Submission } from './Submission';

@Entity()
export class Round extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('datetime')
    submissionsStartedAt!: Date;

    @Column('datetime')
    submissionsEndedAt!: Date;

    @Column('datetime')
    judgingStartedAt!: Date;

    @Column('datetime')
    judgingEndedAt!: Date;

    @Column('datetime')
    resultsAt!: Date;

    @OneToMany(() => JudgeToRound, judgeToRound => judgeToRound.round)
    judgeToRounds!: JudgeToRound[];

    @OneToMany(() => Song, (song) => song.round, {
        cascade: true,
    })
    songs!: Song[];

    @OneToMany(() => Submission, (submission) => submission.round)
    submissions!: Submission[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
