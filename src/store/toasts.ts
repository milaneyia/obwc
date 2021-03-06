import { Module } from 'vuex';
import { MainState } from './main';

export interface ToastMessage {
    message: string;
    type?: 'error' | 'success' | 'info';
}

const toastsModule: Module<{ toastMessages: ToastMessage[] }, MainState> = {
    namespaced: false,
    state: {
        toastMessages: [],
    },
    mutations: {
        addToastMessage (state, message: ToastMessage): void {
            state.toastMessages.push(message);
        },
        removeFirstToastMessage (state): void {
            state.toastMessages.splice(0, 1);
        },
    },
    actions: {
        addToastMessage ({ commit }, message: ToastMessage | string): void {
            if (typeof message === 'string') {
                message = {
                    message,
                };
            }

            commit('addToastMessage', message);

            setTimeout(() => {
                commit('removeFirstToastMessage');
            }, 4000);
        },
    },
};

export default toastsModule;
