<template>
    <div class="card-body p-0">
        <table class="table table-bordered table-sm table-hover table-responsive-sm">
            <thead>
                <tr>
                    <th class="text-left">
                        <a
                            href="#"
                            @click.prevent="sortSubmissionsBy('name')"
                        >
                            Entry's Name
                        </a>
                    </th>
                    <th v-for="criteria in criterias" :key="criteria.id">
                        <a
                            href="#"
                            @click.prevent="sortSubmissionsBy('criteria', criteria.id)"
                        >
                            {{ criteria.name }}
                        </a>
                    </th>
                    <th>
                        <a
                            href="#"
                            @click.prevent="sortSubmissionsBy('total')"
                        >
                            Total
                        </a>
                    </th>
                    <th>
                        <a
                            href="#"
                            @click.prevent="sortSubmissionsBy('completed')"
                        >
                            Completed
                        </a>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="submission in sortedSubmissions" :key="submission.id">
                    <td class="text-left">
                        <a
                            class="me-1"
                            :href="`api/judging/submission/${submission.id}/download`"
                            target="_blank"
                        >
                            <i class="fas fa-file-download" />
                        </a>
                        {{ submission.anonymisedAs }}
                    </td>
                    <td v-for="criteria in criterias" :key="criteria.id">
                        <a
                            href="#"
                            class="d-flex align-items-center justify-content-center"
                            data-bs-toggle="modal"
                            data-bs-target="#editing-judging-modal"
                            @click.prevent="selectForEditing(submission, criteria)"
                        >
                            <i class="me-1 fas fa-edit" />
                            {{ getScore(submission.id, criteria.id) + `/ ${criteria.maxScore}` }}
                        </a>
                    </td>
                    <td>
                        {{ getTotalScore(submission.id) }} / {{ maxPossibleScore }}
                    </td>
                    <td>
                        <i
                            class="fa"
                            :class="isCompleted(submission.id) ? 'fa-check text-success' : 'fa-times text-danger'"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { CreateJudging } from '../../shared/integration';
import { Submission, Round, Criteria, Judging } from '../../shared/models';
import { SELECT_FOR_EDITING } from '../store/judging-types';

export default defineComponent({
    name: 'JudgingTable',

    data () {
        return {
            sortBy: 'name',
            sortByCriteria: 1,
            sortDesc: false,
        };
    },

    computed: {
        ...mapState({
            round: (state: any) => state.judging.currentRound as Round,
            criterias: (state: any) => state.judging.criterias as Criteria[],
            judgingDone: (state: any) => state.judging.judgingDone as Judging[],
            originalJudging: (state: any) => state.judging.originalJudging as CreateJudging | null,
            newJudging: (state: any) => state.judging.newJudging as CreateJudging | null,
        }),

        sortedSubmissions (): Submission[] {
            const submissions = this.round.submissions || [];

            if (this.sortBy === 'name') {
                submissions.sort((a, b) => {
                    const anomA = a.anonymisedAs?.toUpperCase();
                    const anomB = b.anonymisedAs?.toUpperCase();
                    if (anomA < anomB) return this.sortDesc ? -1 : 1;
                    if (anomA > anomB) return this.sortDesc ? 1 : -1;

                    return 0;
                });
            } else if (this.sortBy === 'total') {
                submissions.sort((a, b) => {
                    const aValue = this.getTotalScore(a.id);
                    const bValue = this.getTotalScore(b.id);

                    if (this.sortDesc) {
                        return aValue - bValue;
                    }

                    return bValue - aValue;
                });
            } else if (this.sortBy === 'criteria') {
                submissions.sort((a, b) => {
                    const aValue = this.getScore(a.id, this.sortByCriteria);
                    const bValue = this.getScore(b.id, this.sortByCriteria);

                    if (this.sortDesc) {
                        return aValue - bValue;
                    }

                    return bValue - aValue;
                });
            } else if (this.sortBy === 'completed') {
                submissions.sort((a, b) => {
                    const aValue = this.isCompleted(a.id);
                    const bValue = this.isCompleted(b.id);
                    if (aValue === bValue) return 0;

                    if (this.sortDesc) {
                        return aValue ? 1 : -1;
                    }

                    return aValue ? -1 : 1;
                });
            }

            return submissions;
        },

        maxPossibleScore (): number {
            return this.criterias.reduce((acc, c) => c.maxScore + acc, 0);
        },
    },

    methods: {
        getScore(submissionId: number, criteriaId: number): number {
            const qualifierJudgingToCriterias = this.$store.getters['judging/getJudgingToCriterias']({
                submissionId,
                criteriaId,
            });

            if (!qualifierJudgingToCriterias)
                return 0;

            return qualifierJudgingToCriterias.score;
        },

        getTotalScore(submissionId: number): number {
            const judging = this.judgingDone.find(j => j.submissionId === submissionId);
            if (!judging)
                return 0;

            return judging.judgingToCriterias.reduce((acc, j) => j.score + acc, 0);
        },

        isCompleted(submissionId: number): boolean {
            const judging = this.judgingDone.find(j => j.submissionId === submissionId);
            if (!judging)
                return false;

            return judging.judgingToCriterias.length === this.criterias.length;
        },

        sortSubmissionsBy (type: string, criteriaId?: number): void {
            this.sortBy = type;
            this.sortDesc = !this.sortDesc;

            if (type === 'criteria' && criteriaId) {
                this.sortByCriteria = criteriaId;
            }
        },

        selectForEditing (submission: Submission, criteria: Criteria) {
            if (
                this.originalJudging && this.newJudging &&
                (this.originalJudging?.judgingToCriteria.comment !== this.newJudging?.judgingToCriteria.comment ||
                this.originalJudging?.judgingToCriteria.score !== this.newJudging?.judgingToCriteria.score ||
                this.originalJudging?.judging.comment !== this.newJudging?.judging.comment)
            ) {
                if (!confirm('Changes may be lost, are you sure?')) return;
            }

            this.$store.dispatch('judging/' + SELECT_FOR_EDITING, {
                submission,
                criteria,
            });
        },
    },
});
</script>
