<template>
    <div class="text-center">
        <p>May need to login to continue... if you know what you're looking for</p>
        <a href="/api/login">login <i class="fas fa-external-link-alt fa-sm" /></a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../../shared/models';

export default defineComponent({
    name: 'Login',

    beforeRouteEnter (to, from, next) {
        next(vm => {
            const user: User | null = vm.$store.state.loggedInUser;

            if (user) {
                vm.$router.push({ name: 'home' });
            }
        });
    },
});
</script>
