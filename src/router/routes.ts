/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Home from '../pages/Home.vue';
const TeamCreation = () => import('../pages/TeamCreation.vue');
const Judging = () => import('../pages/Judging.vue');
const Submissions = () => import('../pages/Submissions.vue');

const StaffTeams = () => import('../pages/staff/StaffTeams.vue');
const StaffContests = () => import('../pages/staff/StaffContests.vue');
const StaffRounds = () => import('../pages/staff/StaffRounds.vue');

const NotFound = () => import('../pages/NotFound.vue');

const routes = [
    // Public
    {
        path: '/',
        component: Home,
        alias: '/main',
        name: 'home',
    },
    {
        path: '/dashboard',
        component: Home,
        name: 'dashboard',
        meta: {
            title: 'Dashboard',
            requiresAuth: true,
        },
    },
    {
        path: '/teams/create',
        component: TeamCreation,
        name: 'team-creation',
        meta: {
            title: 'Team Creation',
            requiresAuth: true,
        },
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
            title: 'Submissions',
            requiresAuth: true,
        },
    },

    // Staff
    {
        path: '/staff/teams',
        component: StaffTeams,
        name: 'staff-teams',
        meta: {
            title: 'Teams - Staff',
            requiresStaff: true,
        },
    },
    {
        path: '/staff/contests',
        component: StaffContests,
        name: 'staff-contests',
        meta: {
            title: 'Contests - Staff',
            requiresStaff: true,
        },
    },
    {
        path: '/staff/contests/:id/rounds',
        component: StaffRounds,
        name: 'staff-rounds',
        meta: {
            title: 'Rounds - Staff',
            requiresStaff: true,
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
