import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contest } from './Contest';
import { Country } from './Country';
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

    @ManyToOne(() => Contest, { nullable: false })
    contest!: Contest;

    @Column()
    countryId!: number;

    @ManyToOne(() => Country, (country) => country.teams, { nullable: false })
    country!: Country;

    @Column()
    captainId!: number;

    @OneToOne(() => User, (user) => user.captainFor, { nullable: false })
    @JoinColumn()
    captain!: User;

    @OneToMany(() => User, (user) => user.team)
    users!: User[];

    @ManyToMany(() => User, (user) => user.invitations)
    @JoinTable()
    invitations!: User[];

    @OneToMany(() => Submission, (submissions) => submissions.team)
    submissions!: Submission[];

}
