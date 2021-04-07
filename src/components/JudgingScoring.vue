<template>
    <div v-if="originalJudging && criteria && submission">
        <textarea
            id="comment"
            v-model="newGeneralComment"
            maxlength="3000"
            rows="5"
            class="form-control"
            placeholder="General comment"
        />

        <div class="modal-header">
            <h5
                id="exampleModalLongTitle"
                class="modal-title"
            >
                Editing  <b>{{ criteria.name }}</b> for <b>{{ submission.anonymisedAs }}</b>
            </h5>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="score">Score</label>
                <input
                    id="score"
                    v-model="newScore"
                    type="number"
                    step="1"
                    min="1"
                    :max="criteria.maxScore"
                    class="form-control"
                >
            </div>
            <div
                class="form-group"
            >
                <label for="comment">
                    Comment
                </label>
                <textarea
                    id="comment"
                    v-model="newComment"
                    maxlength="3000"
                    rows="5"
                    class="form-control"
                    placeholder="Criteria specific"
                />
            </div>
        </div>
        <div class="modal-footer">
            <button
                type="button"
                class="btn btn-primary"
                @click.prevent="save()"
            >
                Save changes
            </button>
            <div id="close-button" data-dismiss="modal" />
        </div>
    </div>
    <div v-else class="text-muted">
        Select a score to begin...
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CreateJudging, Criteria, Submission } from '../../shared/interfaces';
import { SAVE, SET_NEW_JUDGING } from '../store/judging-types';

export default defineComponent({
    name: 'JudgingScoring',

    computed: {
        originalJudging (): CreateJudging | null {
            return this.$store.state.judging.originalJudging;
        },

        criteria (): Criteria | undefined {
            return this.originalJudging?.judgingToCriteria?.criteria;
        },

        submission (): Submission | undefined {
            return this.originalJudging?.judging?.submission;
        },

        newGeneralComment: {
            get (): string | undefined {
                return this.$store.state.judging.newJudging?.judging.comment;
            },
            set (value) {
                const judging: CreateJudging = this.cloneNewJudging();
                judging.judging.comment = value;
                this.$store.commit('judging/' + SET_NEW_JUDGING, judging);
            },
        },

        newComment: {
            get (): string | undefined {
                return this.$store.state.judging.newJudging?.judgingToCriteria.comment;
            },
            set (value) {
                const judging: CreateJudging = this.cloneNewJudging();
                judging.judgingToCriteria.comment = value;
                this.$store.commit('judging/' + SET_NEW_JUDGING, judging);
            },
        },

        newScore: {
            get (): number | undefined {
                return this.$store.state.judging.newJudging?.judgingToCriteria.score;
            },
            set (value) {
                const judging: CreateJudging = this.cloneNewJudging();
                judging.judgingToCriteria.score = value;
                this.$store.commit('judging/' + SET_NEW_JUDGING, judging);
            },
        },
    },

    methods: {
        async save () {
            await this.$store.dispatch('judging/' + SAVE);
        },

        cloneNewJudging (): CreateJudging {
            return JSON.parse(JSON.stringify(this.$store.state.judging.newJudging));
        },
    },
});
</script>
