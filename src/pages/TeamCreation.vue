<template>
    <div class="container-fluid">
        <div class="card card-section">
            <div class="card-header">
                <div class="card-header-back">
                    Team Creation
                </div>

                <div class="card-header-sub">
                    <div class="card-header-title">
                        TEAM CREATION
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <h4 class="border-bottom">
                            CREATE YOUR TEAM FOR
                            <span class="text-yellow">
                                {{ user.country.name }}
                            </span>
                        </h4>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm">
                        <ul class="card-text">
                            <li class="text-yellow">
                                Only the captain should do this.
                            </li>
                            <li>You must choose between 2 to 5 mappers.</li>
                            <li>This lists all users registered for your country since last edition of this tournament, if you don't find a specific person it's likely that they have not logged in yet.</li>
                            <li>Once submitted, selected users need to confirm by accepting your invitation (they will recieve a notification when logged in).</li>
                            <li>Staff will finalize your registration once everyone accepted their invitation and the team's name is approved.</li>
                            <li>Be careful, users are <span class="text-yellow">locked</span> once they accept their invitation! However, captains are able to cancel invitations before they get accepted.</li>
                            <li>Captains can change your team name before registration phase is over.</li>
                            <li>Users that accepted your invitation are marked as <span class="text-primary">blue</span>.</li>
                            <li>Choose responsibly.</li>
                        </ul>
                    </div>
                </div>

                <div class="row my-3 g-2">
                    <div class="col-lg-4">
                        <div class="row">
                            <label class="col-sm-3 col-form-label text-end">team name</label>
                            <div class="col-sm-9">
                                <input
                                    v-model="name"
                                    type="text"
                                    class="form-control text-end"
                                    maxlength="16"
                                    placeholder="maximum 16 characters"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="row">
                            <label class="col-sm-3 col-form-label text-end">mode</label>
                            <div class="col-sm-9">
                                <mode-button
                                    v-for="contest in contests"
                                    :key="contest.id"
                                    :contest="contest"
                                    :disabled="!openContests.some(c => c.id === contest.id)"
                                    :selected="selectedContest?.id === contest.id"
                                    @changeSelected="c => selectedContest = c"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 text-end">
                        <button
                            class="btn btn-yellow btn-primary px-5 fw-bold"
                            :disabled="loading"
                            @click="save"
                        >
                            <i class="fas fa-save" />
                            SAVE
                        </button>
                    </div>
                </div>

                <div class="row my-3 g-2">
                    <div class="col-lg-4">
                        <div class="row">
                            <label class="col-sm-3 col-form-label text-end">search</label>
                            <div class="col-sm-9">
                                <input
                                    v-model="filter"
                                    type="text"
                                    class="form-control text-end w-100"
                                    placeholder="filter by username"
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row g-4 justify-content-center justify-content-sm-start">
                    <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="card-user-container"
                        @click.prevent="select(user)"
                    >
                        <div
                            class="card card-body justify-content-center align-items-center h-100 card-user"
                            :class="selectedClass(user)"
                        >
                            <div
                                class="avatar avatar--large"
                                :style="`background-image: url(https://a.ppy.sh/${user.osuId})`"
                            />

                            <div class="mt-5 w-100 text-center">
                                {{ user.username }}
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
import { CreateTeam } from '../../shared/integration';
import { Contest, ContestMode, Team, User } from '../../shared/models';

import ModeButton from '../components/ModeButton.vue';

export default defineComponent({
    components: {
        ModeButton,
    },

    data () {
        return {
            filter: '',
            name: '',
            openContests: [] as Contest[],
            users: [] as User[],
            selectedUsers: [] as User[],
            acceptedUsers: [] as User[],
            selectedContest: null as Contest | null,
            loading: false,
        };
    },

    computed: {
        ...mapState({
            user: (state: any) => state.loggedInUser as User,
            contests: (state: any) => state.contests as Contest[],
        }),

        filteredUsers (): User[] {
            return this.users.filter(u => u.username.toLowerCase().includes(this.filter.toLowerCase()));
        },
    },

    async created () {
        const [{ data: openContests }, { data: users }, { data: team }] = await Promise.all([
            this.$http.get<Contest[]>('/api/contests/open'),
            this.$http.get<User[]>('/api/users?country=' + this.user.country.id),
            this.$http.get<Team | undefined>('/api/teams/mine'),
        ]);

        this.openContests = openContests;

        if (openContests.length) {
            this.selectedContest = openContests[0];
        }

        if (team) {
            this.name = team.name;
            this.selectedContest = team.contest;
            this.selectedUsers = [
                ...team.invitations,
                ...team.users.filter(u => !team.invitations.some(i => i.id === u.id)),
            ];
            this.acceptedUsers = team.users;

            this.users = [
                ...users,
                ...team.users,
            ];
        } else {
            this.users = users;
        }
    },

    methods: {
        select (user: User) {
            if (this.acceptedUsers.some(u => u.id === user.id))
                return;

            const i = this.selectedUsers.findIndex(u => u.id === user.id);

            if (i !== -1) {
                this.selectedUsers.splice(i, 1);
            } else {
                this.selectedUsers.push(user);
            }
        },

        selectedClass (user: User) {
            if (this.acceptedUsers.some(u => u.id === user.id)) {
                return 'bg-primary text-dark border-primary cursor-default';
            }

            if (this.selectedUsers.some(u => u.id === user.id)) {
                return 'bg-yellow text-dark border-yellow';
            }

            return 'border-purple';
        },

        getContestIcon (id: number) {
            let className = 'btn-mode-radio--';

            switch (id) {
                case ContestMode.Standard:
                    return className + 'osu';
                case ContestMode.Taiko:
                    return className + 'taiko';
                case ContestMode.Catch:
                    return className + 'catch';
                case ContestMode.Mania:
                    return className + 'mania';
            }
        },

        save () {
            if (this.selectedUsers.length < 2 || this.selectedUsers.length > 5) {
                return this.$store.dispatch('addToastMessage', 'Number of members needs to be between 2 and 5');
            }

            if (!this.selectedContest) {
                return this.$store.dispatch('addToastMessage', 'Select a contest to participate on');
            }

            this.loading = true;
            const team: CreateTeam = {
                name: this.name,
                invitations: this.selectedUsers,
                contest: this.selectedContest,
            };
            this.$http.post('/api/teams', team)
                .finally(() => this.loading = false);
        },
    },
});
</script>

<style lang="scss">

.btn-mode-radio {
    color: var(--bs-white);
    border-color: var(--bs-white);
    border-width: 2px;

    &:hover, &.active {
        color: #000;
        background-color: #facb5b;
        border-color: #facb5b;
    }

    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px;

    padding: 1.25rem 0.8rem;

    @each $mode in 'osu', 'taiko', 'catch', 'mania' {
        &--#{$mode} {
            background-image: url('../assets/#{$mode}-w.png');
        }

        &--#{$mode}.active {
            background-image: url('../assets/#{$mode}-b.png');
        }
    }
}

</style>
