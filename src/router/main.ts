import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { store } from '../store/main';
import { SET_INITIAL_DATA } from '../store/main-types';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active',
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title as string || `osu! Beatmapping World Championship`;

    if (!store.state.initialized) {
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
