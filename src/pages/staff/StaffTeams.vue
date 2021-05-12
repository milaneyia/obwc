<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-sm">
                <button class="btn btn-sm btn-info me-2" @click="generateTeamList(false)">
                    generate list
                </button>
                <button class="btn btn-sm btn-info" @click="generateTeamList(true)">
                    generate list (only confirmed)
                </button>

                <textarea
                    v-if="generatedTeamList"
                    v-model.trim="generatedTeamList"
                    class="my-4 bg-white text-dark form-control form-control-sm fs-xs"
                    rows="10"
                />
            </div>
        </div>

        <div class="row">
            <div class="col-sm">
                <data-table
                    :items="teams"
                    :fields="fields"
                >
                    <template #cell-users="{ value: users }">
                        <users-links :users="users" />
                    </template>

                    <template #cell-invitations="{ value: invitations }">
                        <users-links :users="invitations" />
                    </template>

                    <template #actions="{ item: team }">
                        <button
                            class="btn btn-sm btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#teamUpdate"
                            @click="selectedTeam = team"
                        >
                            Edit
                        </button>

                        <button
                            v-if="!team.wasConfirmed"
                            class="btn btn-sm btn-success"
                            @click="confirm(team.id)"
                        >
                            Confirm
                        </button>
                        <button
                            v-else
                            class="btn btn-sm btn-danger"
                            @click="deny(team.id)"
                        >
                            Deny
                        </button>
                    </template>
                </data-table>
            </div>
        </div>

        <staff-team-update
            id="teamUpdate"
            :team-prop="selectedTeam"
            @update:team="update($event)"
            @remove:team="remove($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Country, Team, User } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';
import StaffTeamUpdate from '../../components/StaffTeamUpdate.vue';
import UsersLinks from './UsersLinks';

export default defineComponent({
    components: {
        DataTable,
        StaffTeamUpdate,
        UsersLinks,
    },

    data () {
        return {
            teams: [] as Team[],
            selectedTeam: null as Team | null,

            fields: [
                { key: 'country', label: 'Country', formatter: (country: Country) => country.name },
                { key: 'name', label: 'Name' },
                { key: 'captain', label: 'Captain', formatter: (captain: User) => captain.username },
                { key: 'users', label: 'Accepted Users' },
                { key: 'invitations', label: 'Invited Users' },
            ] as Field[],

            generatedTeamList: '',
        };
    },

    async created () {
        const { data } = await this.$http.get('/api/staff/teams');
        this.teams = data;
    },

    methods: {
        async confirm (id: number) {
            await this.$http.put(`/api/staff/teams/${id}/confirm`);
            const i = this.teams.findIndex(t => t.id === id);

            if (i !== -1) {
                this.teams[i].wasConfirmed =  true;
            }
        },

        async deny (id: number) {
            await this.$http.put(`/api/staff/teams/${id}/deny`);
            const i = this.teams.findIndex(t => t.id === id);

            if (i !== -1) {
                this.teams[i].wasConfirmed =  false;
            }
        },

        update (team: Team) {
            const i = this.teams.findIndex(t => t.id === team.id);

            if (i !== -1) {
                this.teams[i] = team;
            }
        },

        remove (teamId: number) {
            const i = this.teams.findIndex(t => t.id === teamId);

            if (i !== -1) {
                this.teams.splice(i, 1);
            }
        },

        generateTeamList (confirmed: boolean) {
            if (this.generatedTeamList && !confirm('this will reset the view')) return;

            let teams: Team[] = confirmed ? this.teams.filter(t => t.wasConfirmed) : this.teams;

            this.generatedTeamList = `|  | Country | Name | Members |\n| :-: | :-: | :-: | :-- |\n`;

            this.generatedTeamList += teams.map(t => `| ![][flag_${t.country.code}] | **${t.country.name}** | **${t.name}** | **[${t.captain.username}](https://osu.ppy.sh/users/${t.captain.osuId})**, ${t.users.map(u => `[${u.username}](https://osu.ppy.sh/users/${u.osuId})`).join(', ')} |\n`);
        },
    },
});
</script>
