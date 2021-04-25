<template>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        Update submission
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />
                </div>
                <div v-if="submissionProp" class="modal-body">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm">
                                <input
                                    v-model="anonymisedAs"
                                    type="text"
                                    class="form-control"
                                    placeholder="Anonymised as..."
                                >
                            </div>
                        </div>
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
import { Submission } from '../../shared/models';

export default defineComponent({
    name: 'StaffSubmissionUpdate',

    props: {
        submissionProp: {
            type: Object as PropType<Submission>,
            default: () => null,
        },
    },

    emits: [
        'update:submission',
    ],

    data () {
        return {
            anonymisedAs: '',
            isSaving: false,
        };
    },

    watch: {
        submissionProp (submission: Submission | null) {
            this.anonymisedAs = submission?.anonymisedAs || '';
        },
    },

    methods: {
        async update () {
            const { data } = await this.$http.put(`/api/staff/submissions/${this.submissionProp.id}`, {
                anonymisedAs: this.anonymisedAs,
            });
            this.$emit('update:submission', data);
        },
    },
});
</script>
