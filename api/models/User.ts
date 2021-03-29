import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, AfterLoad } from 'typeorm';
import { Country } from './Country';
import { Role, ROLE } from './Role';

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

    @ManyToOne(() => Country, (country) => country.users, { nullable: false, eager: true })
    country!: Country;

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
