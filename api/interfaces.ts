export interface Song {
    round: Round;
    title: string;
    link: string;
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
    submissionsStartedAt: Date;
    submissionsEndedAt: Date;
    judgingStartedAt: Date;
    judgingEndedAt: Date;
    resultsAt: Date;
    judgeToRounds: JudgeToRound[],
    songs: Song[],
}

export interface Country {
    name: string;
}

export interface User {
    id: number;
    username: string;
}

export interface Team {
    country: Country;
    captain: User;
    name: string;
    users: User[];
}

export interface CreateJudgeToRound {
    user: User;
    judgingTypeId: number;
}

export interface CreateRound extends Omit<Round, 'judgeToRounds' | 'songs'> {
    judgeToRounds: CreateJudgeToRound[];
    songs: Partial<Song>[];
}

export interface CreateTeam {
    name: string;
    users: User[];
}
