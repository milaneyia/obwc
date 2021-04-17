import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, SelectQueryBuilder, ManyToOne } from 'typeorm';
import { CreateRound } from '../../shared/integration';
import { Contest } from './Contest';
import { JudgeToRound } from './judging/JudgeToRound';
import { JUDGING_TYPE } from './judging/JudgingType';
import { Song } from './Song';
import { Submission } from './Submission';

export enum RoundScope {
    Submission = 'SUBMISSION',
    Judging = 'JUDGING',
    Results = 'RESULTS',
}

@Entity()
export class Round extends BaseEntity {

    static currentRound (scope: RoundScope): SelectQueryBuilder<Round> {
        const query = Round.createQueryBuilder('round')
            .leftJoin('round.submissions', 'submissions')
            .leftJoin('round.judgeToRounds', 'judgeToRounds');

        if (scope === RoundScope.Submission) {
            query.where('round.submissionsStartedAt <= :now')
                .andWhere('round.submissionsEndedAt > :now');
        } else if (scope === RoundScope.Judging) {
            query.where('round.judgingStartedAt <= :now')
                .andWhere('round.judgingEndedAt > :now');
        } else if (scope === RoundScope.Results) {
            query.where('round.resultsAt <= :now');
        }

        return query.setParameter('now', new Date())
            .select([
                'round.id',
                'submissions.id',
                'submissions.anonymisedAs',
                'judgeToRounds',
            ])
            .orderBy('submissions.anonymisedAs');
    }

    static fillAndSave (input: CreateRound, round?: Round): Promise<Round> {
        if (!round) {
            round = new Round();
        }

        round.submissionsStartedAt = input.submissionsStartedAt;
        round.submissionsEndedAt = input.submissionsEndedAt;
        round.judgingStartedAt = input.judgingStartedAt;
        round.judgingEndedAt = input.judgingEndedAt;
        round.resultsAt = input.resultsAt;
        round.judgeToRounds = input.judgeToRounds as JudgeToRound[];
        round.songs = input.songs as Song[];
        round.contest = input.contest as Contest;

        return round.save();
    }

    getJudgeType (userId: number): JUDGING_TYPE | undefined {
        return this.judgeToRounds.find(j => j.userId === userId)?.judgingTypeId;
    }

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

    @ManyToOne(() => Contest, (contest) => contest.rounds, { nullable: false })
    contest!: Contest;

    @OneToMany(() => JudgeToRound, (judgeToRound) => judgeToRound.round, {
        cascade: true,
    })
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
