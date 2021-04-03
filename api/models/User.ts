import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, AfterLoad, OneToMany } from 'typeorm';
import { Country } from './Country';
import { JudgeToRound } from './judging/JudgeToRound';
import { Role, ROLE } from './Role';
import { Team } from './Team';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    roleId!: number;

    @ManyToOne(() => Role, { nullable: false })
    role!: Role;

    @Column()
    countryId!: number;

    @ManyToOne(() => Country, (country) => country.users, { nullable: false, eager: true })
    country!: Country;

    @Column({ nullable: true })
    teamId?: number;

    @ManyToOne(() => Team, (team) => team.users, {
        onDelete: 'SET NULL',
    })
    team?: Team;

    @OneToMany(() => JudgeToRound, (judgeToRound) => judgeToRound.user)
    judgeToRounds!: JudgeToRound[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    isUser!: boolean;
    isRestricted!: boolean;
    isStaff!: boolean;

    @AfterLoad()
    getVirtuals (): void {
        this.isUser = this.roleId === ROLE.User;
        this.isRestricted = this.roleId === ROLE.Restricted;
        this.isStaff = this.roleId === ROLE.Staff;
    }

}
