<template>
    <div class="container">
        <div class="card">
            <div class="card-title">
                Judging List
            </div>
            <div class="card-subtitle">
                Summary of all the judging done
            </div>
        </div>

        <div class="card my-2">
            <data-table
                v-if="resultsData?.round.submissions.length"
                :fields="fields"
                :items="resultsData.round.submissions"
            />

            <div
                v-else
                class="card-body"
            >
                No submissions
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Results } from '../../../shared/integration';
import { Judging, Team } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';

export default defineComponent({
    name: 'StaffJudging',

    components: {
        DataTable,
    },

    data () {
        return {
            resultsData: null as Results | null,
            fields: [
                { key: 'team', label: 'Team', formatter: (team: Team) => team.name },
                { key: 'judging', label: 'Count', formatter: this.getJudgesInvolvedCount },
                { key: 'judging', label: 'Judges', formatter: this.getJudgesInvolved },
            ] as Field[],
        };
    },

    async created (): Promise<void> {
        const { data } = await this.$http.get<Results>(`/api/rounds/${this.$route.params.id}/results`);
        this.resultsData = data;
    },

    methods: {
        getJudgesInvolvedCount (judging: Judging[]): string {
            return judging.map(j => j.judge).length + ' done of ' + this.resultsData?.judges.length;
        },

        getJudgesInvolved (judging: Judging[]): string {
            return judging.map(j => j.judge.username).join(', ');
        },
    },
});
</script>
