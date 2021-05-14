/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Home from '../pages/Home.vue';
const Login = () => import('../pages/Login.vue');
const Info = () => import('../pages/Info.vue');
const Teams = () => import('../pages/Teams.vue');
const Results = () => import('../pages/Results.vue');

const TeamCreation = () => import('../pages/TeamCreation.vue');
const Submissions = () => import('../pages/Submissions.vue');
const Judging = () => import('../pages/Judging.vue');

const StaffTeams = () => import('../pages/staff/StaffTeams.vue');
const StaffContests = () => import('../pages/staff/StaffContests.vue');
const StaffRounds = () => import('../pages/staff/StaffRounds.vue');
const StaffSubmissions = () => import('../pages/staff/StaffSubmissions.vue');
const StaffJudging = () => import('../pages/staff/StaffJudging.vue');

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
        path: '/info',
        component: Info,
        name: 'info',
        meta: {
            title: 'Info | o!bwc',
        },
    },
    {
        path: '/teams',
        component: Teams,
        name: 'teams',
        meta: {
            title: 'Teams | o!bwc',
        },
    },
    {
        path: '/results/:id',
        component: Results,
        name: 'results',
        meta: {
            title: 'Results | o!bwc',
        },
    },

    // Auth
    {
        path: '/teams/create',
        component: TeamCreation,
        name: 'team-creation',
        meta: {
            title: 'Team Creation | o!bwc',
            requiresAuth: true,
        },
    },

    // Judging
    {
        path: '/judging',
        component: Judging,
        name: 'judging',
        meta: {
            title: 'Judging | o!bwc',
            requiresAuth: true,
        },
    },

    // Submissions
    {
        path: '/submissions',
        component: Submissions,
        name: 'submissions',
        meta: {
            title: 'Submissions | o!bwc',
            requiresAuth: true,
        },
    },

    // Staff
    {
        path: '/staff/contests/:id?/teams',
        alias: '/staff/teams',
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
    {
        path: '/staff/rounds/:id/submissions',
        component: StaffSubmissions,
        name: 'staff-submissions',
        meta: {
            title: 'Rounds - Staff',
            requiresStaff: true,
        },
    },
    {
        path: '/staff/rounds/:id/judging',
        component: StaffJudging,
        name: 'staff-judging',
        meta: {
            title: 'Judging - Staff',
            requiresStaff: true,
        },
    },

    // Login
    {
        path: '/login',
        component: Login,
        name: '401',
        meta: { title: 'Login to continue' },
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
