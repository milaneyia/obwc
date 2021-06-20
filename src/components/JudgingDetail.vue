<template>
    <div
        id="detailModal"
        class="modal fade"
        tabindex="-1"
    >
        <div class="modal-dialog modal-lg">
            <div v-if="submission" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ submission.team.name }} - {{ submission.team.country.name }}
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    >
                        &times;
                    </button>
                </div>

                <div class="modal-body">
                    <div
                        v-for="(judging, i) in submission.judging"
                        :key="judging.id"
                    >
                        <b>{{ judging.judge.username }}</b>

                        <div class="my-1">
                            <p class="text-light ms-3">
                                <span class="text-preline">
                                    {{ judging.comment }}
                                </span>
                            </p>
                        </div>

                        <div
                            v-for="judgingToCriterias in judging.judgingToCriterias"
                            :key="judgingToCriterias.id"
                            class="my-1"
                        >
                            <template v-if="judgingToCriterias.comment">
                                <a
                                    data-bs-toggle="collapse"
                                    :href="`#judgingToCriteria${judgingToCriterias.id}`"
                                    @click="showComment(judgingToCriterias.id)"
                                >
                                    <small>
                                        <i
                                            class="fas me-2"
                                            :class="getCollapseClass(judgingToCriterias.id)"
                                        />
                                    </small>
                                    {{ judgingToCriterias.criteria.name }}
                                    <b>({{ judgingToCriterias.score }})</b>:
                                </a>

                                <p
                                    :id="`judgingToCriteria${judgingToCriterias.id}`"
                                    class="text-light ms-3 collapse"
                                >
                                    <span class="text-preline">{{ judgingToCriterias.comment }}</span>
                                </p>
                            </template>
                            <template v-else>
                                {{ judgingToCriterias.criteria.name }}
                                <b>({{ judgingToCriterias.score }})</b>
                            </template>
                        </div>

                        <hr v-if="i < submission.judging.length - 1">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Submission } from '../../shared/models';

export default defineComponent({
    name: 'JudgingDetail',

    props: {
        submission: {
            type: Object as PropType<Submission>,
            default: () => null,
        },
    },

    data () {
        return {
            commentsExpanded: [] as number[],
        };
    },

    methods: {
        showComment (id: number): void {
            const i = this.commentsExpanded.findIndex(j => j === id);
            i !== -1 ? this.commentsExpanded.splice(i, 1) : this.commentsExpanded.push(id);
        },

        getCollapseClass (id: number): string {
            if (this.commentsExpanded.includes(id)) {
                return 'fa-chevron-down';
            }

            return 'fa-chevron-right';
        },
    },
});
</script>

<style lang="scss">

.text-preline {
    white-space: pre-line;
}

</style>
