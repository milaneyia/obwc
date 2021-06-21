import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, SelectQueryBuilder, ManyToOne } from 'typeorm';
import { CreateRound } from '../../shared/integration';
import { JUDGING_TYPE } from '../../shared/models';
import { Contest } from './Contest';
import { JudgeToRound } from './judging/JudgeToRound';
import { Song } from './Song';
import { Submission } from './Submission';

export enum RoundScope {
    Submission = 'SUBMISSION',
    Judging = 'JUDGING',
    Results = 'RESULTS',
}

export enum ResultsScope {
    User = 'USER',
    Staff = 'STAFF',
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

    static async findResults(id: number, judgingType: JUDGING_TYPE, scope: ResultsScope): Promise<Round | undefined> {
        const judges = await JudgeToRound.find({
            roundId: id,
            judgingTypeId: judgingType,
        });
        const query = this
            .createQueryBuilder('round')
            .leftJoinAndSelect('round.submissions', 'submissions')
            .leftJoinAndSelect('round.judgeToRounds', 'judgeToRounds')
            .leftJoinAndSelect('judgeToRounds.user', 'user')
            .leftJoinAndSelect('submissions.judging', 'judging')
            .leftJoinAndSelect('submissions.team', 'team')
            .leftJoinAndSelect('team.country', 'country')
            .leftJoinAndSelect('judging.judge', 'judge')
            .leftJoinAndSelect('judging.judgingToCriterias', 'judgingToCriterias')
            .leftJoinAndSelect('judgingToCriterias.criteria', 'criteria')
            .where('round.id = :id', { id })
            .andWhere('judgeToRounds.judgingTypeId = :judgingTypeId')
            .andWhere('criteria.judgingTypeId = :judgingTypeId')
            .andWhere('judging.judgeId IN (:...judges)', { judges: judges.map(j => j.userId) })
            .setParameter('judgingTypeId', judgingType);

        if (scope === ResultsScope.User) {
            query.andWhere('round.resultsAt <= :now', { now: new Date() });
        }

        return query.getOne();
    }

    static fillAndSave (input: CreateRound, round: Round): Promise<Round> {
        round.submissionsStartedAt = input.submissionsStartedAt;
        round.submissionsEndedAt = input.submissionsEndedAt;
        round.judgingStartedAt = input.judgingStartedAt;
        round.judgingEndedAt = input.judgingEndedAt;
        round.resultsAt = input.resultsAt;
        round.judgeToRounds = input.judgeToRounds as JudgeToRound[];
        round.songs = input.songs as Song[];
        round.downloadLink = input.downloadLink || null;

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

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    downloadLink?: string | null;

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
