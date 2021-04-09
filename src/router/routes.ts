/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Home from '../pages/Home.vue';
const Judging = () => import('../pages/Judging.vue');
const Submissions = () => import('../pages/Submissions.vue');
const NotFound = () => import('../pages/NotFound.vue');

const routes = [
    // Public
    {
        path: '/',
        component: Home,
        alias: '/home',
        name: 'home',
    },

    // Judging
    {
        path: '/judging',
        component: Judging,
        name: 'judging',
        meta: {
            title: 'Judging',
            requiresAuth: true,
        },
    },

    // Submissions
    {
        path: '/submissions',
        component: Submissions,
        name: 'submissions',
        meta: {
            title: 'Submissinos',
            requiresAuth: true,
        },
    },

    // Fallback
    {
        path: '/:pathMatch(.*)*',
        component: NotFound,
        name: '404',
        meta: { title: 'Oops' },
    },
];

export default routes;
