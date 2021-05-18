import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Judging } from './judging/Judging';
import { Round } from './Round';
import { Team } from './Team';

@Entity()
export class Submission extends BaseEntity {

    static fillAndSave (information: string, round: Round, team: Team, fileId: string, submission?: Submission): Promise<Submission> {
        if (!submission) {
            submission = new Submission();
        }

        submission.information = information;
        submission.round = round;
        submission.team = team;
        submission.originalPath = fileId;

        return submission.save();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    originalPath!: string;

    @Column({ nullable: true })
    anonymisedAs!: string;

    @Column()
    teamId!: number;

    @Column({ type: 'text' })
    information!: string;

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
