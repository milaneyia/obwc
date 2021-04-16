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

export type ScopedSubmission = Pick<Submission, 'id' | 'anonymisedAs'>;

export interface Criteria {
    id: number;
    name: string;
    maxScore: number;
    judgingTypeId: number;
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
}

export interface Team {
    country: Country;
    captain: User;
    name: string;
    users: User[];
    invitations: User[];
}

export interface CreateJudgeToRound {
    user: User;
    judgingTypeId: number;
}

export interface CreateRound extends Omit<Round, 'id' | 'submissions' | 'judgeToRounds' | 'songs'> {
    judgeToRounds: CreateJudgeToRound[];
    songs: Partial<Song>[];
}

export interface CreateTeam {
    name: string;
    invitations: User[];
}

export interface CreateJudging {
    judging: {
        submission: ScopedSubmission;
        comment: string;
    };
    judgingToCriteria: {
        criteria: Criteria;
        comment: string;
        score: number;
    };
}

export type ErrorResponse = { error: string };

export function isError<T>(error: T | ErrorResponse): error is ErrorResponse {
    if (!error) return false;

    return (error as ErrorResponse).error !== undefined;
}
