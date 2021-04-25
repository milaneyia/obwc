<template v-cloak>
    <nav
        class="nav navbar navbar-expand-md navbar-dark bg-dark navbar-custom"
    >
        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTarget"
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
                    <router-link class="nav-link" to="/info">
                        RESULTS
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/info">
                        STAFF
                    </router-link>
                </li>
                <li class="nav-item dropdown">
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
            <component :is="Component" />
        </transition>
    </router-view>

    <footer class="footer mt-auto py-2 bg-dark">
        <div class="d-flex justify-content-between align-items-center px-3">
            <div>
                <i class="fab fa-discord fa-2x me-4" />
                <i class="fab fa-twitter fa-2x" />
            </div>
            <div>
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
