<template>
    <div class="container">
        <div class="card">
            <div class="card-title">
                Submissions
            </div>

            <div class="card-subtitle">
                Listing of submissions by round, you NEED to set an anonymised name, otherwise it'll not show up for the judges
            </div>

            <div class="card-body">
                <data-table
                    v-if="submissions.length"
                    :fields="fields"
                    :items="submissions"
                >
                    <template #actions="{ item: submission }">
                        <button
                            class="btn btn-sm btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#submissionUpdate"
                            @click="selectedSubmission = submission"
                        >
                            Edit
                        </button>
                    </template>
                </data-table>

                <span v-else>
                    No submissions
                </span>
            </div>
        </div>

        <staff-submission-update
            id="submissionUpdate"
            :submission-prop="selectedSubmission"
            @update:submission="update($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Submission, Team } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';
import StaffSubmissionUpdate from '../../components/StaffSubmissionUpdate.vue';
import { DateFormat } from '../../formatDate';

export default defineComponent({
    name: 'StaffSubmissions',

    components: {
        DataTable,
        StaffSubmissionUpdate,
    },

    data () {
        return {
            fields: [
                { key: 'team', label: 'Country', formatter: (team: Team) => team.country.name },
                { key: 'team', label: 'Team', formatter: (team: Team) => team.name },
                { key: 'updatedAt', label: 'Submission Last Update', formatter: DateFormat.Locale },
                { key: 'anonymisedAs', label: 'Anonymised As' },
            ] as Field[],

            selectedSubmission: null as Submission | null,
            submissions: [] as Submission[],
        };
    },

    async created (): Promise<void> {
        const { data } = await this.$http.get<Submission[]>(`/api/staff/rounds/${this.$route.params.id}/submissions`);
        this.submissions = data;
    },

    methods: {
        update (submission: Submission) {
            const i = this.submissions.findIndex(s => s.id === submission.id);

            if (i !== -1) {
                this.submissions[i] = submission;
            }
        },
    },
});
</script>
