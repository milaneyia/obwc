<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table
                    :items="formattedTeams"
                    :fields="['name', 'country', 'captain', 'users', 'invitations']"
                >
                    <template #actions="{ item: team }">
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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Team } from '../../../shared/models';
import DataTable from '../../components/DataTable.vue';

export default defineComponent({
    components: {
        DataTable,
    },

    data () {
        return {
            teams: [] as Team[],
        };
    },

    computed: {
        formattedTeams (): Record<string, any>[] {
            return this.teams.map(t => ({
                ...t,
                name: t.name,
                country: t.country.name,
                captain: t.captain.username,
                users: t.users.map(u => u.username).join(', '),
                invitations: t.invitations.map(u => u.username).join(', '),
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
    },
});
</script>
