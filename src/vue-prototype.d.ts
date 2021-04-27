import { Store } from 'vuex';
import MarkdownIt from 'markdown-it';
import http from './http';
import { JudgingState } from './store/judging';
import { MainState } from './store/main';
import { formatDate } from './formatDate';

declare module '@vue/runtime-core' {
    interface State extends MainState {
        judging: JudgingState;
    }

    interface ComponentCustomProperties {
        $http: typeof http;
        $md: MarkdownIt;
        $store: Store<State>;
        $formatDate: typeof formatDate;
    }
}
