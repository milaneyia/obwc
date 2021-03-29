import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Song } from './Song';
import { Submission } from './Submission';
import { User } from './User';

@Entity()
export class Round extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('datetime')
    submissionsStartedAt!: Date;

    @Column('datetime')
    submissionsEndedAt!: Date;

    @Column('datetime')
    judgingStartedAt!: Date;

    @Column('datetime')
    judgingEndedAt!: Date;

    @Column('datetime')
    resultsAt!: Date;

    @ManyToMany(() => User)
    @JoinTable()
    judges!: User[];

    @OneToMany(() => Song, (song) => song.round, {
        cascade: true,
    })
    songs!: Song[];

    @OneToMany(() => Submission, (submission) => submission.round)
    submissions!: Submission[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
