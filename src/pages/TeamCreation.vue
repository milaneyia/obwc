<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card card-body">
                    <h4 class="card-title">
                        Create your team for {{ user.country.name }}
                    </h4>

                    <ul class="card-text">
                        <li>Only the captain should do this.</li>
                        <li>You must choose between 2 to 5 mappers</li>
                        <li>This lists all users registered for your country, if you don't find a specific person it's likely that they haven't logged in (in order to be registered) yet</li>
                        <li>Once submitted, selected users need to confirm by accepting your invitation (ask them to log in and press accept in the home page)</li>
                        <li>Staff will finalize your registration once everyone accepted their invitation and the team's name is accepted</li>
                        <li>You're free to edit whatever before that happens</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="row">
            <a
                v-for="user in users"
                :key="user.id"
                href="#"
                class="col-sm-2 mb-2"
                @click.prevent="select(user)"
            >
                <div
                    class="card card-body justify-content-center align-items-center"
                    :class="selectedClass(user)"
                >
                    <div
                        class="avatar"
                        :style="`background-image: url(https://a.ppy.sh/${user.osuId})`"
                    />

                    <div class="mt-2">
                        {{ user.username }}
                    </div>
                </div>
            </a>
        </div>

        <div class="row">
            <div class="col-sm">
                <select
                    v-model="selectedContest"
                    class="form-control mb-2"
                >
                    <option :value="null" disabled>
                        Select a contest
                    </option>
                    <option
                        v-for="contest in contests"
                        :key="contest.id"
                        :value="contest"
                    >
                        {{ contest.name }}
                    </option>
                </select>

                <input
                    v-model="name"
                    type="text"
                    class="form-control mb-2"
                    maxlength="16"
                    placeholder="team's name (max 16 characters)"
                >

                <button
                    class="btn btn-primary w-100"
                    :disabled="loading"
                    @click="save"
                >
                    Save
                </button>
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
            name: '',
            contests: [] as Contest[],
            users: [] as User[],
            selectedUsers: [] as User[],
            selectedContest: null as Contest | null,
            loading: false,
        };
    },

    computed: mapState({
        user: (state: any) => state.loggedInUser as User,
    }),

    async created () {
        const [{ data: contests }, { data: users }, { data: team }] = await Promise.all([
            this.$http.get<Contest[]>('/api/contests'),
            this.$http.get<User[]>('/api/users?country=' + this.user.country.id),
            this.$http.get<Team | undefined>('/api/teams/mine'),
        ]);

        this.users = users;
        this.contests = contests;

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
                return 'bg-success';
            }

            return '';
        },

        save () {
            if (this.selectedUsers.length < 2 || this.selectedUsers.length > 5) {
                return alert('Number of members needs to be between 2 and 5');
            }

            if (!this.selectedContest) {
                return alert('Select a contest to participate on');
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
