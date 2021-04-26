import { Contest, Criteria, Round, Submission, User } from './models';
import { JudgeCorrel, TeamScore } from '../api/helpers/results';

export type ScopedSubmission = Pick<Submission, 'id' | 'anonymisedAs'>;

export interface CreateJudgeToRound {
    user: User;
    judgingTypeId: number;
}

export interface CreateSong {
    title: string;
    link: string;
}

export interface CreateRound extends Omit<Round, 'id' | 'submissions' | 'judgeToRounds' | 'songs'> {
    judgeToRounds: CreateJudgeToRound[];
    songs: CreateSong[];
    contest?: Contest;
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

export type CreateContest = Omit<Contest, 'id'>

export interface Results {
    criterias: Criteria[],
    round: Round,
    judges: User[],
    teamsScores: TeamScore[],
    judgesCorrel: JudgeCorrel[],
}
