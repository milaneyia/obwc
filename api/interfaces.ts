export interface Song {
    title: string;
    link: string;
}

export interface Round {
    submissionsStartedAt: Date;
    submissionsEndedAt: Date;
    judgingStartedAt: Date;
    judgingEndedAt: Date;
    resultsAt: Date;
    judges: number[],
    songs: Song[],
}

export interface Country {
    name: string;
}

export interface User {
    id: number;
    username: string;
}

export interface CreateTeam {
    name: string;
    users: User[];
}

export interface Team {
    country: Country;
    captain: User;
    name: string;
    users: User[];
}
