<template v-cloak>
    <nav class="nav navbar navbar-expand-md navbar-dark bg-dark navbar-custom">
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTarget"
        >
            <span class="navbar-toggler-icon" />
        </button>

        <div id="navbarTarget" class="collapse navbar-collapse px-3">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'home' }">
                        MAIN
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/info">
                        INFO
                    </router-link>
                </li>
                <li v-if="!isRegistrationOpen" class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'teams' }">
                        TEAMS
                    </router-link>
                </li>
                <li v-if="isResultsTime" class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'results', params: { id: 1 } }">
                        RESULTS
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        v-if="isValidCaptain"
                        class="nav-link"
                        :to="{ name: 'submissions' }"
                    >
                        SUBMISSIONS
                    </router-link>
                </li>
                <li v-if="user && !user.team && isRegistrationOpen" class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'team-creation' }">
                        TEAM CREATION
                    </router-link>
                </li>
                <li v-if="user?.isStaff" class="nav-item dropdown">
                    <a
                        id="navbarDropdown"
                        class="nav-link dropdown-toggle"
                        href="#"
                        data-bs-toggle="dropdown"
                    >
                        MANAGEMENT
                    </a>
                    <ul class="dropdown-menu">
                        <li>
                            <router-link class="dropdown-item" :to="{ name: 'staff-contests' }">
                                Contests
                            </router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" :to="{ name: 'staff-teams', params: { id: standardId } }">
                                Teams (STD)
                            </router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" :to="{ name: 'staff-teams', params: { id: taikoId } }">
                                Teams (Taiko)
                            </router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item" :to="{ name: 'staff-logs' }">
                                Logs
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <ul class="navbar-nav flex-row">
            <li v-if="!user" class="nav-item">
                <a
                    class="nav-link"
                    href="/api/login"
                >
                    LOGIN
                </a>
            </li>
            <template v-else>
                <li class="nav-item">
                    <!-- v-if="isRegistrationOpen" -->
                    <a
                        class="nav-link px-2"
                        href="#"
                        @click.prevent="showProfilePopup = !showProfilePopup"
                    >
                        <i v-if="!user.teamId && !user.captainFor" class="fas fa-exclamation-circle text-danger" />
                        {{ user.username }}
                    </a>
                    <!-- TODO uncomment whenever there's a mode menu -->
                    <!-- <div
                        v-else
                        class="py-2 px-3 cursor-default"
                    >
                        {{ user.username }}
                    </div> -->
                </li>
                <li class="nav-item px-2">
                    <a
                        class="nav-link"
                        href="/api/logout"
                    >
                        LOGOUT
                    </a>
                </li>
            </template>
        </ul>

        <transition name="component-fade">
            <profile-popup v-if="showProfilePopup" @navigate="showProfilePopup = false" />
        </transition>
    </nav>

    <router-view v-slot="{ Component }">
        <transition name="component-fade" mode="out-in">
            <component
                :is="Component"
                class="pt-4 px-sm-4"
                style="padding-bottom: calc(1.5rem + 40px)"
            />
        </transition>
    </router-view>

    <footer class="footer mt-auto bg-dark">
        <div class="d-flex justify-content-between align-items-center pe-3">
            <div class="d-flex w-100 align-items-center">
                <a
                    href="https://2020.obwc.net"
                    target="_blank"
                    class="me-4"
                >
                    <div class="footer__obwc-img" />
                </a>
                <a
                    href="https://discord.gg/CZp4bNx"
                    target="_blank"
                    class="footer__link"
                >
                    <i class="fab fa-discord fa-2x me-4" />
                </a>
                <a
                    href="https://twitter.com/osubwc"
                    target="_blank"
                    class="footer__link"
                >
                    <i class="fab fa-twitter fa-2x me-4" />
                </a>
                <a
                    href="https://www.twitch.tv/osubwc"
                    target="_blank"
                    class="footer__link"
                >
                    <i class="fab fa-twitch fa-2x" />
                </a>
            </div>
            <div class="d-none d-sm-block w-100 text-end">
                osu! Beatmapping World Championship
            </div>
        </div>
    </footer>

    <toast-messages />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Contest, ContestMode, Round, User } from '../shared/models';
import ProfilePopup from './components/ProfilePopup.vue';
import ToastMessages from './components/ToastMessages.vue';

export default defineComponent({
    name: 'App',

    components: {
        ToastMessages,
        ProfilePopup,
    },

    data () {
        return {
            showProfilePopup: false,
        };
    },

    computed: {
        ...mapState({
            user: (state: any) => state.loggedInUser as User | null,
            rounds: (state: any) => state.rounds as Round[],
        }),

        currentContest (): Contest | undefined {
            return this.$store.getters.currentContest;
        },

        isValidCaptain (): boolean {
            return this.user?.captainFor?.wasConfirmed || false;
        },

        isRegistrationOpen (): boolean {
            if (!this.currentContest)
                return false;

            return new Date() >= new Date(this.currentContest.registrationStartedAt) && new Date() < new Date(this.currentContest.registrationEndedAt);
        },

        isResultsTime (): boolean {
            if (!this.rounds.length)
                return false;

            return new Date(this.rounds[0].resultsAt) < new Date();
        },

        standardId (): number {
            return ContestMode.Standard;
        },

        taikoId (): number {
            return ContestMode.Taiko;
        },
    },
});
</script>
