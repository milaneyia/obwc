import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { store } from '../store/main';
import { SET_INITIAL_DATA, UPDATE_CONTEST_MODE } from '../store/main-types';
import { ContestMode } from '../../shared/models';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active',
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title as string || `osu! Beatmapping World Championship`;

    if (!store.state.initialized) {
        let mode = localStorage.getItem('contestMode') ?
            ContestMode[localStorage.getItem('contestMode') as keyof typeof ContestMode] :
            ContestMode.Standard;
        let modeQuery = to.query.mode && to.query.mode.toString();

        if (modeQuery) {
            modeQuery = modeQuery[0].toUpperCase() + modeQuery.substring(1);

            if (modeQuery in ContestMode)
                mode = ContestMode[modeQuery as keyof typeof ContestMode]; // ex: 'Standard'
        }

        store.dispatch(
            UPDATE_CONTEST_MODE,
            mode
        );

        await store.dispatch(SET_INITIAL_DATA);
    }

    if (to.meta.requiresAuth && !store.state.loggedInUser) {
        return next({
            name: '401',
            query: {
                redirect: to.path,
            },
        });
    }

    if (to.meta.requiresStaff && !store.state.loggedInUser?.isStaff) {
        return next({
            name: '404',
        });
    }

    next();
});

export default router;
