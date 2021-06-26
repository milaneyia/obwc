<template>
    <transition name="component-fade">
        <div
            v-if="isLoading"
            class="d-flex justify-content-center align-items-center w-100 h-100"
        >
            <div
                class="spinner-border"
                style="height: 3rem; width: 3rem;"
            />
        </div>
        <data-table
            v-else
            :fields="fields"
            :items="items"
            class="leaderboard"
            @row-click="openDetailModal"
        >
            <template #cell-index="{ index }">
                {{ index + 1 }}
            </template>
            <template #cell-team="{ item: score }">
                <country-flag
                    :country="score.team.country"
                    :title="score.team.name"
                />
                <div v-if="score.isEliminated" class="eliminated-tag">
                    <i class="fas fa-times" /> ELIMINATED
                </div>
            </template>
            <template
                v-for="judge in judges"
                :key="judge.id"
                #[getSlotName(judge.id)]="{ item: score }"
            >
                {{ score['judge-' + judge.id] }} ({{ score['judge-' + judge.id + '-std'] }})
            </template>

            <template
                v-if="displayMode === 'detail'"
                #custom-rows
            >
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
    </transition>

    <judging-detail
        :submission="scoreDetail"
    />
</template>

<script lang="ts">
import Modal from 'bootstrap/js/dist/modal';
import { defineComponent, PropType } from 'vue';
import { mapState } from 'vuex';
import { JudgeCorrel, TeamScore } from '../../api/helpers/results';
import { Criteria, Round, Submission, User } from '../../shared/models';
import { DisplayMode } from '../pages/Results.vue';
import CountryFlag from './CountryFlag.vue';
import DataTable, { Field } from './DataTable.vue';
import JudgingDetail from './JudgingDetail.vue';

interface TeamScoreFormatted extends Pick<TeamScore, 'team' | 'rawFinalScore' | 'standardizedFinalScore'> {
    [key: string]: any;
}

export default defineComponent({
    name: 'Leaderboard',

    components: {
        CountryFlag,
        JudgingDetail,
        DataTable,
    },

    props: {
        displayMode: {
            type: String as PropType<DisplayMode>,
            required: true,
        },

        round: {
            type: Object as PropType<Round | null>,
            default: () => null,
        },

        criterias: {
            type: Array as PropType<Criteria[]>,
            default: () => [],
        },

        teamsScores: {
            type: Array as PropType<TeamScore[]>,
            default: () => [],
        },

        judgesCorrel: {
            type: Array as PropType<JudgeCorrel[]>,
            default: () => [],
        },

        isLoading: {
            type: Boolean,
            default: false,
        },
    },

    data () {
        return {
            selectedScore: null as TeamScoreFormatted | null,
        };
    },

    computed: {
        ...mapState({
            rounds: (state: any) => state.rounds as Round[],
        }),

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
            const fields: Field[] = [
                { key: 'index', label: '#' },
                { key: 'team', label: 'Team' },
            ];

            if (this.displayMode === 'criterias') {
                fields.push(
                    ...this.criterias.map(c => ({
                        key: 'criteria-' + c.id,
                        label: c.name,
                        sortable: true,
                    }))
                );
            } else {
                fields.push(
                    ...this.judges.map(j => ({
                        key: 'judge-' + j.id,
                        label: j.username,
                        sortable: true,
                    }))
                );
            }

            fields.push(...[
                {
                    key: 'rawFinalScore',
                    label: 'Final Score (raw)',
                    sortable: true,
                },
                {
                    key: 'standardizedFinalScore',
                    label: 'Final Score (standardized)',
                    formatter: this.getFinalScore,
                    sortable: true,
                },
            ]);

            return fields;
        },

        items (): TeamScoreFormatted[] {
            return this.teamsScores.map(s => {
                const item: TeamScoreFormatted = {
                    team: s.team,
                    rawFinalScore: s.rawFinalScore,
                    standardizedFinalScore: s.standardizedFinalScore,
                    rowClasses: 'row-clickable',
                    isEliminated: s.isEliminated,
                };

                if (this.displayMode === 'criterias') {
                    for (const criteria of this.criterias) {
                        item['criteria-' + criteria.id] = this.getCriteriaScore(s, criteria.id);
                    }
                } else {
                    for (const judge of this.judges) {
                        item['judge-' + judge.id] = this.getJudgeScore(s, judge.id);
                        item['judge-' + judge.id + '-std'] = this.getJudgeStdScore(s, judge.id);
                    }
                }

                return item;
            });
        },
    },

    methods: {
        getSlotName (judgeId: number): string {
            return 'cell-judge-' + judgeId;
        },

        openDetailModal (score: TeamScoreFormatted): void {
            this.selectedScore = score;
            const el = document.getElementById('detailModal')!;

            let modal = Modal.getInstance(el);

            if (!modal)
                modal = new Modal(el);

            modal.toggle();
        },

        getCriteriaScore (score: TeamScore, criteriaId: number): number {
            return score.criteriaSum.find(c => c.criteriaId === criteriaId)?.sum || 0;
        },

        getJudgeScore (score: TeamScore, judgeId: number): number {
            return score.judgingSum.find(j => j.judgeId === judgeId)?.sum || 0;
        },

        getJudgeStdScore (score: TeamScore, judgeId: number): string {
            const judgeScore = score.judgingSum.find(j => j.judgeId === judgeId);
            const stdScore = judgeScore?.standardized || 0;

            return stdScore.toFixed(3);
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
    },
});
</script>

<style lang="scss" scoped>
.cursor-default td {
    cursor: default;
}

.eliminated-tag {
    margin-left: calc(30px + 0.5rem);
    font-size: 0.6rem;
    color: var(--bs-red);
}
</style>
