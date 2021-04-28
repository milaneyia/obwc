<template>
    <div class="container-fluid">
        <div class="card card-section">
            <div class="card-header">
                <div class="card-header-back">
                    <img src="../assets/home_prizes.png">
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
                            <li>You must choose between 2 to 5 mappers</li>
                            <li>This lists all users registered for your country, if you don't find a specific person it's likely that they have not been registered yet</li>
                            <li>Once submitted, selected users need to confirm by accepting your invitation (they will recieve a notification when logged in)</li>
                            <li>Staff will finalize your registration once everyone accepted their invitation and the team's name is approved</li>
                            <li>You are free to perform any edits <span class="text-yellow">before</span> your team is finalized by staff</li>
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
                                <template
                                    v-for="contest in contests"
                                    :key="contest.id"
                                >
                                    <input
                                        :id="'mode-' + contest.id"
                                        v-model="selectedContest"
                                        type="radio"
                                        class="btn-check"
                                        autocomplete="off"
                                        :value="contest"
                                        :disabled="!openContests.some(c => c.id === contest.id)"
                                    >
                                    <label
                                        class="btn btn-mode-radio me-2"
                                        :class="selectedContest?.id === contest.id ? 'active' : ''"
                                        :for="'mode-' + contest.id"
                                    >
                                        <i class="fas" :class="[getContestIcon(contest.id)]" />
                                    </label>
                                </template>
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

                <div class="row row-cols-12 g-4">
                    <div
                        v-for="user in filteredUsers"
                        :key="user.id"
                        class="col"
                        @click.prevent="select(user)"
                    >
                        <div
                            class="card card-body justify-content-center align-items-center card-user"
                            :class="selectedClass(user)"
                        >
                            <div
                                class="avatar avatar--large"
                                :style="`background-image: url(https://a.ppy.sh/${user.osuId})`"
                            />

                            <div class="mt-5">
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
import { Contest, Team, User } from '../../shared/models';

export default defineComponent({
    data () {
        return {
            filter: '',
            name: '',
            contests: [] as Contest[],
            openContests: [] as Contest[],
            users: [] as User[],
            selectedUsers: [] as User[],
            selectedContest: null as Contest | null,
            loading: false,
        };
    },

    computed: {
        ...mapState({
            user: (state: any) => state.loggedInUser as User,
        }),

        filteredUsers (): User[] {
            return this.users.filter(u => u.username.includes(this.filter));
        },
    },

    async created () {
        const [{ data: contests }, { data: openContests }, { data: users }, { data: team }] = await Promise.all([
            this.$http.get<Contest[]>('/api/contests'),
            this.$http.get<Contest[]>('/api/contests/open'),
            this.$http.get<User[]>('/api/users?country=' + this.user.country.id),
            this.$http.get<Team | undefined>('/api/teams/mine'),
        ]);

        this.users = users;
        this.contests = contests;
        this.openContests = openContests;

        if (team) {
            this.name = team.name;
            this.selectedUsers = [
                ...team.users,
                ...team.invitations,
            ];
        }
    },

    methods: {
        select (user: User) {
            const i = this.selectedUsers.findIndex(u => u.id === user.id);

            if (i !== -1) {
                this.selectedUsers.splice(i, 1);
            } else {
                this.selectedUsers.push(user);
            }
        },

        selectedClass (user: User) {
            if (this.selectedUsers.some(u => u.id === user.id)) {
                return 'bg-yellow text-dark border-yellow';
            }

            return 'border-purple';
        },

        getContestIcon (id: number) {
            switch (id) {
                case 1:
                    return 'fa-circle';
                case 2:
                    return 'fa-drum';
                case 3:
                    return 'fa-apple-alt';
                case 4:
                    return 'fa-stream';
                default:
                    return 'fa-times';
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

.card-user {
    cursor: pointer;
}

.btn-mode-radio {
    color: var(--bs-white);
    border-color: var(--bs-white);

    &:hover, &.active {
        color: #000;
        background-color: #facb5b;
        border-color: #facb5b;
    }
}

</style>