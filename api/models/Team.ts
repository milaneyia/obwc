import { AfterLoad, BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JUDGING_TYPE } from '../../shared/models';
import { getRoundResults } from '../helpers/results';
import { Contest } from './Contest';
import { Country } from './Country';
import { ResultsScope } from './Round';
import { Submission } from './Submission';
import { User } from './User';

@Entity()
export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ default: false })
    wasConfirmed!: boolean;

    @Column()
    countryId!: number;

    @ManyToOne(() => Country, (country) => country.teams, { nullable: false })
    country!: Country;

    @Column()
    captainId!: number;

    @OneToOne(() => User, (user) => user.captainFor, { nullable: false })
    @JoinColumn()
    captain!: User;

    @Column()
    contestId!: number;

    @ManyToOne(() => Contest, (contest) => contest.teams, { nullable: false })
    contest!: Contest;

    @OneToMany(() => User, (user) => user.team)
    users!: User[];

    @ManyToMany(() => User, (user) => user.invitations)
    @JoinTable()
    invitations!: User[];

    @OneToMany(() => Submission, (submissions) => submissions.team)
    submissions!: Submission[];

    isEliminated!: boolean;

    @AfterLoad()
    async getElimination (): Promise<void> {
        for (const round of this.contest.rounds.filter(r => new Date(r.resultsAt) < new Date())) {
            const mapperResults = await getRoundResults(round.id, JUDGING_TYPE.Mappers, ResultsScope.User);
            const playersResults = await getRoundResults(round.id, JUDGING_TYPE.Players, ResultsScope.User);

            const mappingEliminated = mapperResults.teamsScores.filter(teams => teams.isEliminated).some(teams => teams.team.id === this.id);
            const playerEliminated = playersResults.teamsScores.filter(teams => teams.isEliminated).some(teams => teams.team.id === this.id);

            this.isEliminated = mappingEliminated && playerEliminated;
        }
    }

}
