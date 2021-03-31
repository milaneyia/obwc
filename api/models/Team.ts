import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './Country';
import { Submission } from './Submission';
import { User } from './User';

@Entity()
export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    countryId!: number;

    @ManyToOne(() => Country, (country) => country.teams, { nullable: false })
    country!: Country;

    @Column()
    captainId!: number;

    @OneToOne(() => User, { nullable: false })
    @JoinColumn()
    captain!: User;

    @OneToMany(() => User, (user) => user.team)
    users!: User[];

    @OneToMany(() => Submission, (submissions) => submissions.team)
    submissions!: Submission[];

}
