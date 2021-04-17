import { Contest, Criteria, Round, Song, Submission, User } from './models';

export type ScopedSubmission = Pick<Submission, 'id' | 'anonymisedAs'>;

export interface CreateJudgeToRound {
    user: User;
    judgingTypeId: number;
}

export interface CreateRound extends Omit<Round, 'id' | 'submissions' | 'judgeToRounds' | 'songs'> {
    judgeToRounds: CreateJudgeToRound[];
    songs: Partial<Song>[];
    contest: Contest;
}

export interface CreateTeam {
    name: string;
    invitations: User[];
    contest: Contest;
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

export interface CreateContest {
    name: string;
    isOpen: boolean;
}
