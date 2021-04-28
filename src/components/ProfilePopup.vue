<template>
    <div class="card card-body small rounded-3 bg-dark position-absolute profile text-start me-sm-3">
        <div class="d-flex align-items-center justify-content-between">
            <div>FOR TEAM CREATION, CLICK HERE</div>
            <i class="fas fa-arrow-right mx-2" />
            <router-link
                :to="{ name: 'team-creation' }"
                class="btn btn-sm btn-outline-yellow"
                @click="$emit('navigate')"
            >
                CREATE A TEAM
            </router-link>
        </div>

        <div class="border-bottom my-3">
            ANY TEAM INVITATIONS WILL APPEAR BELOW
        </div>

        <div
            v-for="invitation in user.invitations"
            :key="invitation.id"
            class="card card-body flex-column flex-sm-row align-items-center bg-yellow text-dark py-2 px-3 my-2"
        >
            <div
                class="avatar"
                :style="`background-image: url(https://a.ppy.sh/${invitation.captain.osuId})`"
            />

            <div class="mx-4">
                <div class="text-uppercase">
                    {{ invitation.captain.username }} INVITES YOU TO JOIN
                </div>
                <div>{{ invitation.name }}</div>
            </div>

            <button
                class="btn btn-sm btn-dark text-yellow"
                :disabled="Boolean(user.teamId)"
                @click="accept(invitation.id)"
            >
                {{ user.teamId === invitation.id ? 'ACCEPTED' : 'ACCEPT' }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { User } from '../../shared/models';
import { SET_INITIAL_DATA } from '../store/main-types';

export default defineComponent({
    name: 'ProfilePopup',

    emits: [
        'navigate',
    ],

    computed: mapState({
        user: (state: any) => state.loggedInUser as User,
    }),

    methods: {
        async accept (id: number) {
            await this.$http.post(`/api/teams/${id}/acceptInvitation`);
            const { data } = await this.$http.get<User>('/api/users/me');
            this.$store.commit(SET_INITIAL_DATA, data);
        },
    },
});
</script>

<style lang="scss">

.profile {
    z-index: 1080;
    border: 2px dashed var(--bs-blue);
    right: 0;
    top: 88%;
    max-width: 500px;
}

</style>
