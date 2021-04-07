<template v-cloak>
    <header class="d-flex align-items-center pb-3 mb-5 border-bottom">
        <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
            <img
                src="./assets/logo.png"
                width="50"
                height="50"
                alt=""
            >
            <span class="fs-4">obwc</span>
        </a>
        <a href="/api/login">
            login
        </a>
    </header>

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
