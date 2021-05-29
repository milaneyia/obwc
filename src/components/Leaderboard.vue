<template>
    <data-table
        v-bind="$attrs"
        :fields="fields"
        :items="teamsScores"
    >
        <template #cell-index="{ index }">
            {{ index + 1 }}
        </template>
        <template #cell-team="{ item: score }">
            <country-flag
                :country="score.team.country"
                :title="score.team.name"
            />
        </template>
        <!-- <template v-if="displayMode === 'criterias'">
                    <td v-for="criteria in criterias" :key="criteria.id">
                        {{ getCriteriaScore(score, criteria.id) }}
                    </td>
                </template>
                <template v-else>
                    <td v-for="judge in judges" :key="judge.id">
                        {{ getJudgeScore(score, judge.id, displayMode === 'detail') }}
                    </td>
                </template> -->

        <!-- <td>
                    <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#detailModal"
                        @click.prevent="selectedScore = score"
                    >
                        Detail
                    </a>
                </td> -->

        <template v-if="displayMode === 'detail'">
            <tr class="cursor-default">
                <td />
                <td>AVG</td>
                <td v-for="judge in judges" :key="judge.id">
                    {{ getJudgeAvg(judge.id) }}
                </td>
                <td />
                <td />
            </tr>
            <tr class="cursor-default">
                <td />
                <td>SD</td>
                <td v-for="judge in judges" :key="judge.id">
                    {{ getJudgeSd(judge.id) }}
                </td>
                <td />
                <td />
            </tr>
            <tr class="cursor-default">
                <td />
                <td>COR</td>
                <td v-for="judge in judges" :key="judge.id">
                    {{ getJudgeCorrel(judge.id) }}
                </td>
                <td />
                <td />
            </tr>
        </template>
    </data-table>

    <judging-detail
        :submission="scoreDetail"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { JudgeCorrel, TeamScore } from '../../api/helpers/results';
import { Results } from '../../shared/integration';
import { Contest, Criteria, Round, Submission, Team, User } from '../../shared/models';
import { UPDATE_ROUNDS } from '../store/main-types';
import CountryFlag from './CountryFlag.vue';
import DataTable, { Field } from './DataTable.vue';
import JudgingDetail from './JudgingDetail.vue';

export default defineComponent({
    name: 'Leaderboard',

    components: {
        CountryFlag,
        JudgingDetail,
        DataTable,
    },

    props: {
        displayMode: {
            type: String,
            required: true,
        },
    },

    data () {
        return {
            selectedScore: null as TeamScore | null,
            sortDesc: false,

            round: null as Round | null,
            criterias: [] as Criteria[],
            teamsScores: [] as TeamScore[],
            judgesCorrel: [] as JudgeCorrel[],

        };
    },

    computed: {
        ...mapState({
            rounds: (state: any) => state.rounds as Round[],
        }),

        standardContest (): Contest {
            return this.$store.getters.standardContest;
        },

        scoreDetail (): Submission | undefined {
            if (this.selectedScore) {
                return this.round?.submissions?.find(s => s.team.id == this.selectedScore?.team.id);
            }

            return undefined;
        },

        judges (): User[] {
            return this.round?.judgeToRounds.map(j => j.user) || [];
        },

        fields (): Field[] {
            const fields = [
                { key: 'index', label: '#' },
                { key: 'team', label: 'Team' },
            ] as Field[];

            if (this.displayMode === 'criterias') {
                fields.push(
                    ...this.criterias.map(c => ({
                        key: 'criteria-' + c.id,
                        label: c.name,
                    }))
                );
            } else {
                fields.push(
                    ...this.judges.map(j => ({
                        key: 'judge-' + j.id,
                        label: j.username,
                    }))
                );
            }

            fields.push(...[
                { key: 'rawFinalScore', label: 'Final Score (raw)' },
                { key: 'standardizedFinalScore', label: 'Final Score (standardized)', formatter: this.getFinalScore },
            ]);

            return fields;
        },
    },

    async created () {
        if (!this.rounds.length)  {
            await this.$store.dispatch(UPDATE_ROUNDS, this.standardContest.id);
        }

        const roundId = this.$route.params.id || this.rounds[0]?.id;

        const { data } = await this.$http.get<Results>(`/api/rounds/${roundId}/results`);
        this.round = data.round;
        this.criterias = data.criterias;
        this.teamsScores = data.teamsScores;
        this.judgesCorrel = data.judgesCorrel;
    },

    methods: {
        getCriteriaScore (score: TeamScore, criteriaId: number): number {
            return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
        },
        getJudgeScore (score: TeamScore, judgeId: number, std = false): number | string {
            const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);
            const stdScore = judgeScore?.standardized || 0;

            if (std) {
                return `${judgeScore?.sum || 0} (${stdScore.toFixed(3)})`;
            }

            return judgeScore?.sum || 0;
        },
        getJudgeAvg (id: number): number | string {
            return this.judgesCorrel.find(j => j.id === id)?.rawAvg.toFixed(4) || 0;
        },
        getJudgeSd (id: number): number | string {
            return this.judgesCorrel.find(j => j.id === id)?.sd.toFixed(4) || 0;
        },
        getJudgeCorrel (id: number): number | string {
            const correl = this.judgesCorrel.find(j => j.id === id)?.correl || 0;

            return correl.toFixed(4);
        },
        getFinalScore (standardizedFinalScore: number): string {
            return (!standardizedFinalScore || isNaN(standardizedFinalScore)) ? '0' : standardizedFinalScore.toFixed(4);
        },
        sortByCriteria (criteriaId: number): void {
            this.sortDesc = !this.sortDesc;
            this.$store.commit('sortByCriteria', {
                criteriaId,
                sortDesc: this.sortDesc,
            });
        },
        sortByJudge (judgeId: number): void {
            this.sortDesc = !this.sortDesc;
            this.$store.commit('sortByJudge', {
                judgeId,
                sortDesc: this.sortDesc,
            });
        },
        sortByRawScore (): void {
            this.sortDesc = !this.sortDesc;
            this.$store.commit('sortByRawScore', {
                sortDesc: this.sortDesc,
            });
        },
        sortByStdScore (): void {
            this.sortDesc = !this.sortDesc;
            this.$store.commit('sortByStdScore', {
                sortDesc: this.sortDesc,
            });
        },
    },
});
</script>

<style lang="scss" scoped>
.cursor-default td {
    cursor: default;
}
</style>
