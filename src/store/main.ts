import { createStore } from 'vuex';
import { User } from '../../shared/interfaces';
import judgingModule from './judging';
import { SET_INITIAL_DATA, UPDATE_LOADING_STATE } from './main-types';

export interface MainState {
    initialized: boolean;
    isLoading: boolean;
    loggedInUser: User | null;
}

export const store = createStore<MainState>({
    modules: {
        judging: judgingModule,
    },
    state: {
        initialized: false,
        isLoading: false,
        loggedInUser: null,
    },
    mutations: {
        [SET_INITIAL_DATA] (state, user: User | null) {
            state.loggedInUser = user || null;
            state.initialized = true;
        },
        [UPDATE_LOADING_STATE] (state) {
            state.isLoading = !state.isLoading;
        },
    },
    strict: process.env.NODE_ENV !== 'production',
});
