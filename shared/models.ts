export interface Song {
    round: Round;
    title: string;
    link: string;
}

export interface Judging {
    id: number;
    judgeId: number;
    judge: User;
    submissionId: number;
    submission: Submission;
    criteria: Criteria;
    judgingToCriterias: JudgingToCriteria[];
    comment: string;
}

export interface JudgingToCriteria {
    id: number;
    judgingId: number;
    criteriaId: number;
    criteria: Criteria;
    score: number;
    comment: string;
}

export interface Submission {
    id: number;
    information: string;
    originalPath: string;
    anonymisedAs: string;
    round: Round;
    team: Team;
    judging: Judging[];
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
    downloadLink?: string;
    judgeToRounds: JudgeToRound[];
    songs: Song[];
    submissions: Submission[];
}

export interface Country {
    id: number;
    name: string;
    code: string;
}

export interface User {
    id: number;
    username: string;
    osuId: number;
    country: Country;
    teamId?: number | null;
    team?: Team | null;
    invitations: Team[];
    captainFor?: Team;
    isStaff: boolean;
}

export interface EliminationDetails {
    mappingEliminated: boolean,
    playerEliminated: boolean,
}

export interface Team {
    id: number;
    country: Country;
    captain: User;
    contest: Contest;
    name: string;
    users: User[];
    invitations: User[];
    wasConfirmed: boolean;
}

export enum ContestMode {
    Standard = 1,
    Taiko,
    Catch,
    Mania,
}

export interface Contest {
    id: number;
    name: string;
    announcementAt: Date;
    registrationStartedAt: Date;
    registrationEndedAt: Date;
}

export interface Log {
    id: number;
    text: string;
    type: string;
    createdAt: Date;
}
