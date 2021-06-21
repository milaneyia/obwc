<template>
    <div class="container">
        <div class="card">
            <div class="card-title">
                Judging List
            </div>
            <div class="card-subtitle">
                Summary of all the judging done, for detailed scoring go to the result page
                <router-link :to="{ name: 'results', query: { round: $route.params.id } }">
                    here
                </router-link>
            </div>
        </div>

        <div class="card my-2">
            <div
                v-if="resultsData?.round.submissions.length"
                class="card-body"
            >
                <div class="mb-2">
                    Type:
                    <a
                        class="me-2"
                        href="#"
                        @click.prevent="judgingType = 1"
                    >
                        mapper
                    </a>
                    <a
                        href="#"
                        @click.prevent="judgingType = 2"
                    >
                        player
                    </a>
                </div>

                <data-table
                    :fields="fields"
                    :items="resultsData.round.submissions"
                />
            </div>

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
import { Judging, JUDGING_TYPE, Team, User } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';

export default defineComponent({
    name: 'StaffJudging',

    components: {
        DataTable,
    },

    data () {
        return {
            judgingType: JUDGING_TYPE.Mappers,
            resultsData: null as Results | null,
            fields: [
                { key: 'team', label: 'Team', formatter: (team: Team) => team.name },
                { key: 'judging', label: 'Count', formatter: this.getJudgesInvolvedCount },
                { key: 'judging', label: 'Judges', formatter: this.getJudgesInvolved },
                { key: 'judging', label: 'Missing Judges', formatter: this.getMissingJudges },
            ] as Field[],
        };
    },

    computed: {
        allJudges (): User[] {
            return this.resultsData?.judges || [];
        },
    },

    watch: {
        judgingType: {
            async handler (type: JUDGING_TYPE): Promise<void> {
                const { data } = await this.$http.get<Results>(`/api/rounds/${this.$route.params.id}/results?type=${type}`);
                this.resultsData = data;
            },

            immediate: true,
        },
    },

    methods: {
        getJudgesInvolvedCount (judging: Judging[]): string {
            return judging.map(j => j.judge).length + ' done of ' + this.resultsData?.judges.length;
        },

        getJudgesInvolved (judging: Judging[]): string {
            return judging.map(j => j.judge.username).join(', ');
        },

        getMissingJudges (judging: Judging[]): string {
            return this.allJudges.filter(judge => judging.every(j => j.judge.id !== judge.id))
                .map(j => j.username)
                .join(', ');
        },
    },
});
</script>
