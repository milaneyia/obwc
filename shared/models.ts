export interface Song {
    round: Round;
    title: string;
    link: string;
}

export interface Judging {
    judgeId: number;
    submissionId: number;
    submission: Submission;
    criteria: Criteria;
    judgingToCriterias: JudgingToCriteria[];
    comment: string;
}

export interface JudgingToCriteria {
    judgingId: number;
    criteriaId: number;
    score: number;
    comment: string;
}

export interface Submission {
    id: number;
    originalPath: string;
    anonymisedAs: string;
    round: Round;
    updatedAt: Date;
}

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
    judgingTypeId: number;
}

export enum JUDGING_TYPE {
    Mappers = 1,
    Players = 2,
}

export interface JudgingType {
    name: string;
}

export interface JudgeToRound {
    round: Round;
    user: User;
    judgingTypeId: number;
    judgingType: JudgingType;
}

export interface Round {
    id: number;
    submissionsStartedAt: Date;
    submissionsEndedAt: Date;
    judgingStartedAt: Date;
    judgingEndedAt: Date;
    resultsAt: Date;
    judgeToRounds: JudgeToRound[];
    songs: Song[];
    submissions: Submission[];
}

export interface Country {
    id: number;
    name: string;
}

export interface User {
    id: number;
    username: string;
    osuId: number;
    country: Country;
    isStaff: boolean;
}

export interface Team {
    id: number;
    country: Country;
    captain: User;
    name: string;
    users: User[];
    invitations: User[];
    wasConfirmed: boolean;
}

export interface Contest {
    id: number;
    name: string;
    isOpen: boolean;
}