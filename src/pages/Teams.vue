<template>
    <div class="container-fluid">
        <div class="card card-section">
            <div class="card-header">
                <div class="card-header-back">
                    Teams
                </div>

                <div class="card-header-sub">
                    <div class="card-header-title">
                        TEAMS
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="container">
                    <div
                        v-for="team in teams"
                        :key="team.id"
                        class="row mb-2"
                    >
                        <div class="col-lg-2 mb-2 mb-lg-0">
                            <div class="card card-body flex-column align-items-center justify-content-between border-2 border-yellow rounded-2 ms-auto">
                                <div class="fst-italic fs-sm text-yellow">
                                    {{ team.name }}
                                </div>
                                <img
                                    class="team-flag my-2"
                                    :src="`https://osu.ppy.sh/images/flags/${team.country.code}.png`"
                                    :alt="team.country.code"
                                >

                                <div class="text-yellow fs-sm fw-lighter">
                                    TEAM
                                </div>
                                <div class="text-uppercase">
                                    {{ team.country.name }}
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-10">
                            <div class="card card-body border-2 border-purple rounded-2 h-100">
                                <div class="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 gap-2">
                                    <a
                                        class="col d-flex flex-column align-items-center justify-content-between user-link"
                                        :href="`https://osu.ppy.sh/users/${team.captain.osuId}`"
                                        target="_blank"
                                    >
                                        <div
                                            class="avatar avatar--x-large mb-2 border-yellow"
                                            :style="`background-image: url(https://a.ppy.sh/${team.captain.osuId})`"
                                        />

                                        <div class="d-flex flex-column align-items-center">
                                            <div class="fs-sm text-yellow">
                                                CAPTAIN
                                            </div>
                                            <div>{{ team.captain.username }}</div>
                                        </div>
                                    </a>

                                    <a
                                        v-for="user in team.users"
                                        :key="user.id"
                                        class="col d-flex flex-column align-items-center justify-content-between user-link"
                                        :href="`https://osu.ppy.sh/users/${user.osuId}`"
                                        target="_blank"
                                    >
                                        <div
                                            class="avatar avatar--x-large mb-2"
                                            :style="`background-image: url(https://a.ppy.sh/${user.osuId})`"
                                        />
                                        <div>
                                            {{ user.username }}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Team } from '../../shared/models';
import { UPDATE_TEAMS } from '../store/main-types';

export default defineComponent({

    computed: mapState({
        teams: (state: any) => state.teams as Team[],
    }),

    async created (): Promise<void> {
        if (!this.teams?.length) {
            await this.$store.dispatch(UPDATE_TEAMS);
        }
    },

});
</script>

<style lang="scss">

.team-flag {
    width: 70px * 1.5;
    height: 47px * 1.5;
}

.user-link {
    color: var(--bs-white);
    text-decoration: none;

    &:hover {
        color: var(--bs-purple);
    }

    &:hover > .avatar {
        border-color: var(--bs-purple) !important;
    }
}

</style>
