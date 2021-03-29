import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Team } from './Team';

@Entity()
export class Country extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column({ unique: true })
    code!: string;

    @OneToMany(() => User, (user) => user.country)
    users!: User[];

    @OneToMany(() => Team, (team) => team.country)
    teams!: Team[];

}
