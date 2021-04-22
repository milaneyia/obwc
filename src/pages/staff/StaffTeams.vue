<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table :items="formattedTeams" />
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
        formattedTeams (): Record<string, string>[] {
            return this.teams.map(t => ({
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
});
</script>
