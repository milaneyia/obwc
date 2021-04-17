import { Module } from 'vuex';
import { CreateJudging } from '../../shared/integration';
import { Criteria, Judging, JudgingToCriteria, Round, Submission } from '../../shared/models';
import { MainState } from './main';
import http from '../http';
import { INIT_DATA, SET_ORIGINAL_JUDGING, SET_NEW_JUDGING, SELECT_FOR_EDITING, SAVE } from './judging-types';

interface InitResponse {
    currentRound: Round | null;
    criterias: Criteria[];
    judgingDone: Judging[];
}

export interface JudgingState {
    currentRound: Round | null;
    criterias: Criteria[];
    judgingDone: Judging[];

    originalJudging: CreateJudging | null;
    newJudging: CreateJudging | null;
}

const store: Module<JudgingState, MainState> = {
    namespaced: true,
    state: {
        currentRound: null,
        criterias: [],
        judgingDone: [],

        originalJudging: null,
        newJudging: null,
    },

    mutations: {
        [INIT_DATA] (state, payload) {
            state.currentRound = payload.currentRound || null;
            state.criterias = payload.criterias || [];
            state.judgingDone = payload.judgingDone || [];
        },
        [SET_ORIGINAL_JUDGING] (state, payload) {
            state.originalJudging = payload;
        },
        [SET_NEW_JUDGING] (state, payload) {
            state.newJudging = payload;
        },
    },

    getters: {
        getJudgingToCriterias: (state) => (payload: { submissionId: number; criteriaId: number; }): JudgingToCriteria | null => {
            const judging = state.judgingDone.find(j => j.submissionId === payload.submissionId);
            if (!judging)
                return null;

            const judgingToCriterias = judging.judgingToCriterias.find(j => j.criteriaId === payload.criteriaId);
            if (!judgingToCriterias)
                return null;

            return judgingToCriterias;
        },

        getJudgingForEditing: (state) => (payload: { submission: Submission; criteria: Criteria; }): CreateJudging => {
            const baseObj = {
                judging: {
                    submission: payload.submission,
                    comment: '',
                },
                judgingToCriteria: {
                    criteria: payload.criteria,
                    score: 1,
                    comment: '',
                },
            };

            const judging = state.judgingDone.find(j => j.submissionId === payload.submission.id);
            if (!judging)
                return baseObj;

            baseObj.judging.comment = judging.comment;

            const judgingToCriterias = judging.judgingToCriterias.find(j => j.criteriaId === payload.criteria.id);
            if (!judgingToCriterias)
                return baseObj;

            baseObj.judgingToCriteria.score = judgingToCriterias.score;
            baseObj.judgingToCriteria.comment = judgingToCriterias.comment;

            return baseObj;
        },
    },

    actions: {
        async [INIT_DATA] ({ commit }) {
            const { data } = await http.get<InitResponse>('/api/judging');
            commit(INIT_DATA, data);
        },

        [SELECT_FOR_EDITING] ({ commit, getters }, payload: { submission: Submission; criteria: Criteria }) {
            const judging = getters.getJudgingForEditing({
                submission: payload.submission,
                criteria: payload.criteria,
            });

            commit(SET_NEW_JUDGING, judging);
            commit(SET_ORIGINAL_JUDGING, judging);
        },

        async [SAVE] ({ dispatch, state }) {
            if (!state.newJudging) return;

            await http.post('/api/judging', state.newJudging);
            await dispatch(INIT_DATA);
            dispatch(SELECT_FOR_EDITING, {
                submission: state.newJudging.judging.submission,
                criteria: state.newJudging.judgingToCriteria.criteria,
            });
        },
    },
};

export default store;
