import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { JudgingToCriteria } from './JudgingToCriteria';
import { JudgingType } from './JudgingType';

@Entity()
export class Criteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    maxScore!: number;

    @Column()
    judgingTypeId!: number;

    @ManyToOne(() => JudgingType, { nullable: false })
    judgingType!: JudgingType;

    @OneToMany(() => JudgingToCriteria, judgingToCriteria => judgingToCriteria.criteria)
    judgingToCriterias!: JudgingToCriteria[];

}
