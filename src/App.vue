<template v-cloak>
    <nav class="nav navbar navbar-expand-md navbar-dark bg-dark navbar-custom justify-content-end text-end">
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
                <li class="nav-item">
                    <router-link class="nav-link" to="/info">
                        TEAMS
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" :to="{ name: 'results', params: { id: 1 } }">
                        RESULTS
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/info">
                        STAFF
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
                    </ul>
                </li>
            </ul>
            <ul class="navbar-nav">
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
                        <router-link
                            class="nav-link"
                            :to="{ name: 'dashboard' }"
                        >
                            <i class="fas fa-user" />
                            {{ user.username }}
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="/api/logout"
                        >
                            LOGOUT
                        </a>
                    </li>
                </template>
            </ul>
        </div>
    </nav>

    <router-view v-slot="{ Component }">
        <transition name="component-fade" mode="out-in">
            <component
                :is="Component"
                class="pt-4"
                style="padding-bottom: calc(1.5rem + 40px)"
            />
        </transition>
    </router-view>

    <footer class="footer mt-auto bg-dark">
        <div class="d-flex justify-content-between align-items-center pe-3">
            <div>
                <a
                    href="https://2020.obwc.net"
                    target="_blank"
                    class="me-4 d-none d-sm-inline-block"
                >
                    <img
                        src="./assets/2020_link.png"
                        class="img-fluid"
                        style="max-height: 56px"
                    >
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
            <div class="d-none d-sm-block">
                osu! Beatmapping World Championship
            </div>
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { User } from '../shared/models';

export default defineComponent({
    name: 'App',

    computed: mapState({
        user: (state: any) => state.loggedInUser as User | null,
    }),

});
</script>
