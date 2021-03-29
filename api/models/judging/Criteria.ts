import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { JudgingToCriteria } from './JudgingToCriteria';

export enum JudgingType {
    Mappers = 1,
    Playes = 2,
}

@Entity()
export class Criteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    maxScore!: number;

    @Column()
    type!: number;

    @OneToMany(() => JudgingToCriteria, judgingToCriteria => judgingToCriteria.criteria)
    judgingToCriterias!: JudgingToCriteria[];

}
