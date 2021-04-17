<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-sm">
                <div class="card">
                    <div class="card-body">
                        <table v-if="submissions" class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Round</th>
                                    <th>Submission Date</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="submission in submissions"
                                    :key="submission.id"
                                >
                                    <td> {{ submission.round.id }}</td>
                                    <td>
                                        {{ submission.updatedAt }}
                                    </td>
                                    <td>
                                        <a
                                            v-if="submission.originalPath"
                                            :href="`/api/submissions/${submission.id}/download`"
                                        >
                                            download
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="currentRound">
            <div class="row">
                <div class="col-sm">
                    <div class="card">
                        <div class="card-body">
                            <p>
                                You have from <b>{{ currentRound.submissionsStartedAt }}</b> to
                                <b>{{ currentRound.submissionsEndedAt }}</b> to submit your entry
                            </p>

                            <hr>

                            <label>
                                .osz File (20Mb max)
                            </label>

                            <input
                                id="oszFile"
                                type="file"
                                class="form-control"
                                @change="uploadFile($event)"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm">
                    <button class="btn btn-primary btn-block" @click="save($event)">
                        <div
                            v-if="isSaving"
                            class="spinner-border spinner-border-sm align-middle"
                            role="status"
                        >
                            <span class="sr-only">Loading...</span>
                        </div>
                        <span v-else>Save</span>
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Round, Submission, User } from '../../shared/models';

interface ApiResponse {
    submissions: Submission[];
    currentRound: Round | null;
}

export default defineComponent({

    data () {
        return {
            submissions: [] as Submission[],
            currentRound: null as Round | null,
            oszFile: null as File | null,
            isSaving: false,
        };
    },

    computed: mapState({
        user: (state: any) => state.loggedInUser as User,
    }),

    async created (): Promise<void> {
        await this.getData();
    },

    methods: {
        async getData (): Promise<void> {
            const { data } = await this.$http.get<ApiResponse>('/api/submissions');
            this.submissions = data.submissions;
            this.currentRound = data.currentRound;
        },

        async save (e: Event): Promise<void> {
            if (!this.oszFile) {
                alert('Select an .osz');

                return;
            }

            (e?.target as HTMLInputElement).disabled = true;
            this.isSaving = true;
            const formData = new FormData();
            formData.append('oszFile', this.oszFile);

            const { data } = await this.$http.post('/api/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                await this.getData();
                alert('Saved!');
            }

            this.isSaving = false;
            (e?.target as HTMLInputElement).disabled = false;
        },

        uploadFile (e: any) {
            this.oszFile = e.target?.files?.[0];
        },
    },

});
</script>
