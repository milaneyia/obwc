<template>
    <data-table
        custom-class="table-bordered table-sm"
        :fields="fields"
        :items="items"
    >
        <template
            v-for="criteria in criterias"
            :key="criteria.id"
            #[getSlotName(criteria.id)]="{ item: submission, value }"
        >
            <a
                href="#"
                class="d-flex align-items-center justify-content-center"
                @click.prevent="selectForEditing(submission.id, criteria)"
            >
                <i class="me-1 fas fa-edit" />
                {{ value }} / {{ criteria.maxScore }}
            </a>
        </template>
        <template #cell-total="{ value }">
            {{ value }} / {{ maxPossibleScore }}
        </template>
        <template #cell-completed="{ value: completed }">
            <i
                class="fa"
                :class="completed ? 'fa-check text-success' : 'fa-times text-danger'"
            />
        </template>
    </data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { CreateJudging } from '../../shared/integration';
import { Round, Criteria, Judging } from '../../shared/models';
import { SELECT_FOR_EDITING } from '../store/judging-types';
import DataTable, { Field } from './DataTable.vue';

interface RowJudgingFormatted {
    id: number;
    anonymisedAs: string;
    total: number;
    completed: boolean;
    [key: string]: any;
}

export default defineComponent({
    name: 'JudgingTable',

    components: {
        DataTable,
    },

    computed: {
        ...mapState({
            round: (state: any) => state.judging.currentRound as Round,
            criterias: (state: any) => state.judging.criterias as Criteria[],
            judgingDone: (state: any) => state.judging.judgingDone as Judging[],
            originalJudging: (state: any) => state.judging.originalJudging as CreateJudging | null,
            newJudging: (state: any) => state.judging.newJudging as CreateJudging | null,
        }),

        fields (): Field[] {
            const fields: Field[] = [
                { key: 'anonymisedAs', label: `Entry's Name`, sortable: true },
            ];

            fields.push(
                ...this.criterias.map(c => ({
                    key: 'criteria-' + c.id,
                    label: c.name,
                    sortable: true,
                })),
                { key: 'total', label: 'Total', sortable: true },
                { key: 'completed', label: 'Completed', sortable: true }
            );

            return fields;
        },

        items (): RowJudgingFormatted[] {
            return this.round.submissions.map(s => {
                const item: RowJudgingFormatted = {
                    id: s.id,
                    anonymisedAs: s.anonymisedAs,
                    total: this.getTotalScore(s.id),
                    completed: this.isCompleted(s.id),
                };

                for (const criteria of this.criterias) {
                    item['criteria-' + criteria.id] = this.getScore(s.id, criteria.id);
                }

                return item;
            });
        },

        maxPossibleScore (): number {
            return this.criterias.reduce((acc, c) => c.maxScore + acc, 0);
        },
    },

    methods: {
        getSlotName (criteriaId: number): string {
            return 'cell-criteria-' + criteriaId;
        },

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

        selectForEditing (submissionId: number, criteria: Criteria) {
            if (
                this.originalJudging && this.newJudging &&
                (this.originalJudging?.judgingToCriteria.comment !== this.newJudging?.judgingToCriteria.comment ||
                this.originalJudging?.judgingToCriteria.score !== this.newJudging?.judgingToCriteria.score ||
                this.originalJudging?.judging.comment !== this.newJudging?.judging.comment)
            ) {
                if (!confirm('Changes may be lost, are you sure?')) return;
            }

            this.$store.dispatch('judging/' + SELECT_FOR_EDITING, {
                submission: this.round.submissions.find(s => s.id === submissionId),
                criteria,
            });
        },
    },
});
</script>
