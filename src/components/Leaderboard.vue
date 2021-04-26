<template>
    <div class="container">
        <div class="row my-3">
            <div class="col-sm">
                <a
                    href="#"
                    :class="displayMode === 'criterias' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'criterias'"
                >
                    Per criteria
                </a>
                |
                <a
                    href="#"
                    :class="displayMode === 'judges' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'judges'"
                >
                    Per judge
                </a>
                |
                <a
                    href="#"
                    :class="displayMode === 'detail' ? 'border-bottom border-secondary' : ''"
                    @click.prevent="displayMode = 'detail'"
                >
                    Std detail
                </a>
                <template v-if="round && new Date() >= new Date(round.resultsAt) && round.downloadLink">
                    |
                    <a
                        :href="round.downloadLink"
                        target="_blank"
                    >
                        Download all entries
                    </a>
                </template>
            </div>
        </div>
        <div class="row">
            <div class="col-sm">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Team</th>
                            <template v-if="displayMode === 'criterias'">
                                <th
                                    v-for="criteria in criterias"
                                    :key="criteria.id"
                                >
                                    <a
                                        href="#"
                                        @click.prevent="sortByCriteria(criteria.id)"
                                    >
                                        {{ criteria.name }}
                                    </a>
                                </th>
                            </template>
                            <template v-else>
                                <th
                                    v-for="judge in judges"
                                    :key="judge.id"
                                >
                                    <a
                                        href="#"
                                        @click.prevent="sortByJudge(judge.id)"
                                    >
                                        {{ judge.username }}
                                    </a>
                                </th>
                            </template>
                            <th>
                                <a
                                    href="#"
                                    @click.prevent="sortByRawScore"
                                >
                                    Final Score (raw)
                                </a>
                            </th>
                            <th>
                                <a
                                    href="#"
                                    @click.prevent="sortByStdScore"
                                >
                                    Final Score (standardized)
                                </a>
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(score, i) in teamsScores"
                            :key="i"
                        >
                            <td>{{ i + 1 }}</td>
                            <td>
                                <country-flag
                                    :country="score.team.country"
                                    :title="score.team.name"
                                />
                            </td>
                            <template v-if="displayMode === 'criterias'">
                                <td v-for="criteria in criterias" :key="criteria.id">
                                    {{ getCriteriaScore(score, criteria.id) }}
                                </td>
                            </template>
                            <template v-else>
                                <td v-for="judge in judges" :key="judge.id">
                                    {{ getJudgeScore(score, judge.id, displayMode === 'detail') }}
                                </td>
                            </template>

                            <td>{{ score.rawFinalScore }}</td>
                            <td>{{ getFinalScore(score.standardizedFinalScore) }}</td>
                            <td>
                                <a
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#detailModal"
                                    @click.prevent="selectedScore = score"
                                >
                                    Detail
                                </a>
                            </td>
                        </tr>

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
                    </tbody>
                </table>
            </div>
        </div>

        <judging-detail
            :submission="scoreDetail"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { JudgeCorrel, TeamScore } from '../../api/helpers/results';
import { Results } from '../../shared/integration';
import { Criteria, Round, Submission, User } from '../../shared/models';
import CountryFlag from './CountryFlag.vue';
import JudgingDetail from './JudgingDetail.vue';

export default defineComponent({
    name: 'Leaderboard',

    components: {
        CountryFlag,
        JudgingDetail,
    },

    data () {
        return {
            selectedScore: null as TeamScore | null,
            displayMode: 'criterias' as 'criterias' | 'judges' | 'detail',
            sortDesc: false,

            round: null as Round | null,
            criterias: [] as Criteria[],
            teamsScores: [] as TeamScore[],
            judgesCorrel: [] as JudgeCorrel[],
        };
    },

    computed: {
        scoreDetail (): Submission | undefined {
            if (this.selectedScore) {
                return this.round?.submissions?.find(s => s.team.id == this.selectedScore?.team.id);
            }

            return undefined;
        },

        judges (): User[] {
            return this.round?.judgeToRounds.map(j => j.user) || [];
        },
    },

    async created () {
        const { data } = await this.$http.get<Results>(`/api/rounds/${this.$route.params.id}/results`);
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
