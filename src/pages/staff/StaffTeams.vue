<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table
                    :items="formattedTeams"
                    :fields="['name', 'country', 'captain', 'usersNames', 'invitationsNames']"
                >
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
import { Team } from '../../../shared/models';
import DataTable from '../../components/DataTable.vue';
import StaffTeamUpdate from '../../components/StaffTeamUpdate.vue';

export default defineComponent({
    components: {
        DataTable,
        StaffTeamUpdate,
    },

    data () {
        return {
            teams: [] as Team[],
            selectedTeam: null as Team | null,
        };
    },

    computed: {
        formattedTeams (): Record<string, any>[] {
            return this.teams.map(t => ({
                ...t,
                name: t.name,
                country: t.country.name,
                captain: t.captain.username,
                usersNames: t.users.map(u => u.username).join(', '),
                invitationsNames: t.invitations.map(u => u.username).join(', '),
            }));
        },
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
    },
});
</script>
