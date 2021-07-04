<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table
                    :items="contests"
                    :fields="fields"
                >
                    <template #actions="{ item: contest }">
                        <button
                            class="btn btn-sm btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#contestUpdate"
                            @click="selectedContest = contest"
                        >
                            Edit
                        </button>
                        <router-link class="btn btn-sm btn-link me-2" :to="{ name: 'staff-rounds', params: { id: contest.id } }">
                            Rounds
                        </router-link>
                        <router-link class="btn btn-sm btn-link" :to="{ name: 'staff-teams', params: { id: contest.id } }">
                            Teams
                        </router-link>
                    </template>
                </data-table>
            </div>
        </div>

        <staff-contest-update
            id="contestUpdate"
            :contest-prop="selectedContest"
            @update:contest="update($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Contest } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';
import StaffContestUpdate from '../../components/StaffContestUpdate.vue';
import { DateFormat } from '../../formatDate';

export default defineComponent({
    name: 'StaffContests',

    components: {
        DataTable,
        StaffContestUpdate,
    },

    data () {
        return {
            contests: [] as Contest[],
            selectedContest: null as Contest | null,

            fields: [
                'id',
                'name',
                { key: 'announcementAt', label: 'Announcement Date', formatter: DateFormat.Locale },
                { key: 'registrationStartedAt', label: 'Registration Start', formatter: DateFormat.Locale },
                { key: 'registrationEndedAt', label: 'Registration End', formatter: DateFormat.Locale },
            ] as Field[],
        };
    },

    async created () {
        const { data } = await this.$http.get('/api/contests');
        this.contests = data;
    },

    methods: {
        update (contest: Contest) {
            const i = this.contests.findIndex(c => c.id === contest.id);

            if (i !== -1) {
                this.contests[i] = contest;
            }
        },
    },
});
</script>
