import { createStore } from 'vuex';
import { Contest } from '../../api/models/Contest';
import { User, ContestMode, Team, Round } from '../../shared/models';
import http from '../http';
import judgingModule from './judging';
import { SET_INITIAL_DATA, UPDATE_USER, UPDATE_CONTESTS, UPDATE_ROUNDS, UPDATE_TEAMS, SET_INITIALIZED } from './main-types';
import toastsModule from './toasts';

function numberToOrdinal (id: number): string {
    switch (id) {
        case 1:
            return 'FIRST';
        case 2:
            return 'SECOND';
        case 3:
            return 'THIRD';
        case 4:
            return 'FOURTH';
        case 5:
            return 'FIFTH';
        default:
            return id.toString();
    }
}

export interface Schedule {
    announcement: Date | null,
    registration: [Date, Date],
    rounds: { title: string, mapping: [Date, Date], judging: [Date, Date] }[],
    results: Date | null,
}

export interface MainState {
    initialized: boolean;
    loggedInUser: User | null;
    contests: Contest[];
    rounds: Round[];
    teams: Team[];
}

export const store = createStore<MainState>({
    modules: {
        judging: judgingModule,
        toasts: toastsModule,
    },

    state: {
        initialized: false,
        loggedInUser: null,
        contests: [],
        rounds: [],
        teams: [],
    },

    mutations: {
        [SET_INITIALIZED] (state) {
            state.initialized = true;
        },

        [UPDATE_USER] (state, user: User | null | undefined) {
            state.loggedInUser = user || null;
        },

        [UPDATE_CONTESTS] (state, contests) {
            state.contests = contests;
        },

        [UPDATE_ROUNDS] (state, rounds) {
            state.rounds = rounds || [];
        },

        [UPDATE_TEAMS] (state, teams) {
            state.teams = teams;
        },
    },

    getters: {
        standardContest (state): Contest | undefined {
            return state.contests.find(c => c.id === ContestMode.Standard);
        },

        schedule (state, getters): Schedule | undefined {
            if (!getters.standardContest) {
                return;
            }

            const schedule: Schedule = {
                announcement: getters.standardContest.announcementAt,
                registration: [getters.standardContest.registrationStartedAt, getters.standardContest.registrationEndedAt],
                rounds: [],
                results: null,
            };

            if (state.rounds.length) {
                schedule.rounds = state.rounds.map(r => ({
                    title: numberToOrdinal(r.id) + ' ROUND',
                    mapping: [r.submissionsStartedAt, r.submissionsEndedAt],
                    judging: [r.judgingStartedAt, r.judgingEndedAt],
                }));
                schedule.results = state.rounds[state.rounds.length - 1].resultsAt;
            }

            return schedule;
        },

        currentSubmissionRound (state): Round | undefined {
            return state.rounds.find(r => new Date() >= new Date(r.submissionsStartedAt) && new Date() < new Date(r.submissionsEndedAt));
        },
    },

    actions: {
        async [SET_INITIAL_DATA] ({ commit, dispatch }) {
            await Promise.all([
                dispatch(UPDATE_USER),
                dispatch(UPDATE_CONTESTS),
            ]);

            commit(SET_INITIALIZED);
        },

        async [UPDATE_USER] ({ commit }) {
            const { data } = await http.get<User>('/api/users/me');
            commit(UPDATE_USER, data);
        },

        async [UPDATE_CONTESTS] ({ commit }) {
            const { data: contests } = await http.get<Contest[]>('/api/contests');
            commit(UPDATE_CONTESTS, contests);
        },

        async [UPDATE_ROUNDS] ({ commit }, contestId: number) {
            const { data: rounds } = await http.get<Round[]>(`/api/contests/${contestId}/rounds`);
            commit(UPDATE_ROUNDS, rounds);
        },

        async [UPDATE_TEAMS] ({ commit }) {
            const { data: teams } = await http.get<Team[]>('/api/teams');
            commit(UPDATE_TEAMS, teams);
        },
    },

    strict: process.env.NODE_ENV !== 'production',
});
