<template>
    <div class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-lg">
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
                        v-model="contest.name"
                        type="text"
                        class="form-control mb-3"
                        placeholder="name"
                    >

                    <hr>

                    <div class="row mb-2">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label>Announcement Date</label>
                                <input
                                    v-model="contest.announcementAt"
                                    type="datetime-local"
                                    class="form-control"
                                >
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Registration Start Date</label>
                                <input
                                    v-model="contest.registrationStartedAt"
                                    type="datetime-local"
                                    class="form-control"
                                >
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Registration End Date</label>
                                <input
                                    v-model="contest.registrationEndedAt"
                                    type="datetime-local"
                                    class="form-control"
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
import { CreateContest } from '../../shared/integration';
import { Contest } from '../../shared/models';

export default defineComponent({
    name: 'StaffContestUpdate',

    props: {
        contestProp: {
            type: Object as PropType<Contest>,
            default: () => null,
        },
    },

    emits: [
        'update:contest',
    ],

    data () {
        return {
            contest: null as CreateContest |  null,
        };
    },

    watch: {
        contestProp (obj: Contest | null) {
            if (!obj) {
                this.contest = null;

                return;
            }

            this.contest = {
                name: obj.name,
                announcementAt: this.formatDate(obj.announcementAt) as any,
                registrationStartedAt: this.formatDate(obj.registrationStartedAt) as any,
                registrationEndedAt: this.formatDate(obj.registrationEndedAt) as any,
            };
        },
    },

    methods: {
        formatValue (value: number): number | string {
            if (value < 10)
                return '0' + value;

            return value;
        },

        formatDate (originalDate: Date) {
            const date = new Date(originalDate);
            const month = this.formatValue(date.getMonth() + 1);
            const day = this.formatValue(date.getDate());
            const hours = this.formatValue(date.getHours());
            const minutes = this.formatValue(date.getMinutes());

            //yyyy-MM-ddThh:mm
            return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
        },

        async update () {
            if (!this.contest) return;

            const { data } = await this.$http.put<Contest>(`/api/staff/contests/${this.contestProp.id}`, {
                name: this.contest.name,
                announcementAt: this.contest.announcementAt,
                registrationStartedAt: this.contest.registrationStartedAt,
                registrationEndedAt: this.contest.registrationEndedAt,
            } as CreateContest);
            this.$emit('update:contest', data);
        },
    },
});
</script>
