import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ROLE {
    User = 1,
    Restricted = 2,
    Staff = 3,
}

@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

}
