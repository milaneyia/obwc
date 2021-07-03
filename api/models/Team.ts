import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EliminationDetails, JUDGING_TYPE } from '../../shared/models';
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

    async getElimination (): Promise<EliminationDetails> {
        const mapperResults = await getRoundResults(1, JUDGING_TYPE.Mappers, ResultsScope.User);
        const playersResults = await getRoundResults(1, JUDGING_TYPE.Players, ResultsScope.User);

        const mappingEliminated = mapperResults.teamsScores.some(ts => ts.team.id === this.id && ts.isEliminated);
        const playerEliminated = playersResults.teamsScores.some(ts => ts.team.id === this.id && ts.isEliminated);

        return { mappingEliminated, playerEliminated };
    }

}
