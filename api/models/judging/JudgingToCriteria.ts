import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Criteria } from './Criteria';
import { Judging } from './Judging';

@Entity()
export class JudgingToCriteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judgingId!: number;

    @Column()
    criteriaId!: number;

    @ManyToOne(() => Judging, judging => judging.judgingToCriterias)
    judging!: Judging;

    @ManyToOne(() => Criteria, criteria => criteria.judgingToCriterias)
    criteria!: Criteria;

    @Column()
    score!: number;

    @Column({ type: 'text', nullable: true })
    comment!: string;
}
