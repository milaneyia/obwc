import { createStore } from 'vuex';
import { Contest } from '../../api/models/Contest';
import { User, ContestMode } from '../../shared/models';
import http from '../http';
import judgingModule from './judging';
import { SET_INITIAL_DATA, UPDATE_USER, UPDATE_CONTESTS, SET_INITIALIZED } from './main-types';
import toastsModule from './toasts';

export interface MainState {
    initialized: boolean;
    loggedInUser: User | null;
    contests: Contest[];
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
    },

    getters: {
        standardContest (state): Contest | undefined {
            return state.contests.find(c => c.id === ContestMode.Standard);
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
    },

    strict: process.env.NODE_ENV !== 'production',
});
