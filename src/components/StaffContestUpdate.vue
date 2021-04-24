<template>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Update Contest
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />
                </div>
                <div v-if="contest" class="modal-body">
                    <input
                        v-model="name"
                        type="text"
                        class="form-control mb-3"
                        placeholder="name"
                    >

                    <div class="form-check">
                        <input
                            id="isOpen"
                            v-model="isOpen"
                            class="form-check-input"
                            type="checkbox"
                        >
                        <label class="form-check-label" for="isOpen">
                            Is Open?
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="update"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CreateContest } from '../../shared/integration';
import { Contest } from '../../shared/models';

export default defineComponent({
    name: 'StaffContestUpdate',

    props: {
        contest: {
            type: Object as PropType<Contest>,
            default: () => null,
        },
    },

    emits: [
        'update:contest',
    ],

    data () {
        return {
            name: '',
            isOpen: false,
        };
    },

    watch: {
        contest (obj: Contest | null) {
            this.name = obj?.name || '';
            this.isOpen = obj?.isOpen || false;
        },
    },

    methods: {
        async update () {
            const { data } = await this.$http.put<Contest>(`/api/staff/contests/${this.contest.id}`, {
                name: this.name,
                isOpen: this.isOpen,
            } as CreateContest);
            this.$emit('update:contest', data);
        },
    },
});
</script>
