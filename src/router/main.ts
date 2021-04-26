import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { store } from '../store/main';
import { ErrorResponse } from '../../shared/extras';
import { User } from '../../shared/models';
import http from '../http';
import { SET_INITIAL_DATA } from '../store/main-types';

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active',
});

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title as string || `osu! Beatmapping World Championship`;

    if (!store.state.initialized) {
        const { data } = await http.get<User | ErrorResponse>('/api/users/me');
        store.commit(SET_INITIAL_DATA, data);
    }

    if (
        (to.meta.requiresAuth && !store.state.loggedInUser) ||
        (to.meta.requiresStaff && !store.state.loggedInUser?.isStaff)
    ) {
        return next({
            name: '404',
        });
    }

    next();
});

export default router;
