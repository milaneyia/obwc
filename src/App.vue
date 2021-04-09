<template v-cloak>
    <!-- <nav
        class="nav navbar navbar-expand-md navbar-dark navbar-triangles"
    >
        <router-link to="/" class="navbar-brand p-0">
            <img
                src="./assets/logo.png"
                width="50"
                height="50"
                alt="obwc2021"
            >
            OBWC 2021
        </router-link>

        <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarTarget"
        >
            <span class="navbar-toggler-icon" />
        </button>

        <div id="navbarTarget" class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link class="nav-link small" to="/">
                        Home
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link small" to="/info">
                        Info
                    </router-link>
                </li>
            </ul>
        </div>
    </nav> -->

    <router-view v-slot="{ Component }">
        <transition name="component-fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
});
</script>
