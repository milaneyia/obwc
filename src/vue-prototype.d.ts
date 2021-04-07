import { Store } from 'vuex';
import http from './http';
import { JudgingState } from './store/judging';
import { MainState } from './store/main';

declare module '@vue/runtime-core' {
    interface State extends MainState {
        judging: JudgingState;
    }

    interface ComponentCustomProperties {
        $http: typeof http;
        $store: Store<State>;
    }
}
