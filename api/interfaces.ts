export interface Song {
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

export interface CreateRound extends Omit<Round, 'judgeToRounds'> {
    judgeToRounds: Partial<JudgeToRound>[]
}

export interface CreateTeam {
    name: string;
    users: User[];
}
