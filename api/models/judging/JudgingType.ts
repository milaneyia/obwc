import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum JUDGING_TYPE {
    Mappers = 1,
    Players = 2,
}

@Entity()
export class JudgingType extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

}
