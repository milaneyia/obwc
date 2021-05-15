<template>
    <div class="container-fluid">
        <div class="card card-section">
            <div class="card-header">
                <div class="card-header-back">
                    Submissions
                </div>

                <div class="card-header-sub">
                    <div class="card-header-title">
                        SUBMISSIONS
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="container">
                    <div class="row">
                        <div class="col-sm">
                            <data-table
                                v-if="submissions"
                                :fields="fields"
                                :items="submissions"
                            />
                        </div>
                    </div>

                    <template v-if="currentRound">
                        <hr>

                        <div class="row mb-3">
                            <div class="col-sm">
                                <p class="text-center">
                                    You have from <b><time-string :timestamp="currentRound.submissionsStartedAt" /></b> to
                                    <b><time-string :timestamp="currentRound.submissionsEndedAt" /></b> to submit your entry
                                </p>

                                <hr>

                                <div>
                                    <label for="oszFile" class="form-label">.osz File (15Mb max)</label>
                                    <input
                                        id="oszFile"
                                        class="form-control"
                                        type="file"
                                        @change="uploadFile($event)"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm">
                                <button class="btn btn-yellow w-100" @click="save($event)">
                                    <div
                                        v-if="isSaving"
                                        class="spinner-border spinner-border-sm align-middle"
                                        role="status"
                                    >
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                    <span v-else>
                                        <i class="fas fa-save" />
                                        Save
                                    </span>
                                </button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Contest, Round, Submission, User } from '../../shared/models';
import DataTable, { Field, Format } from '../components/DataTable.vue';
import TimeString from '../components/TimeString.vue';
import { UPDATE_ROUNDS } from '../store/main-types';

export default defineComponent({
    components: {
        DataTable,
        TimeString,
    },

    data () {
        return {
            submissions: [] as Submission[],
            oszFile: null as File | null,
            isSaving: false,

            fields: [
                { key: 'round', label: 'Round', formatter: (round: Round) => round.id },
                { key: 'updatedAt', label: 'Update Date', formatter: Format.DateTimeString },
            ] as Field[],
        };
    },

    computed: mapState({
        user: (state: any) => state.loggedInUser as User,
        rounds: (state: any) => state.rounds as Round[],

        standardContest (): Contest {
            return this.$store.getters.standardContest;
        },

        currentRound (): Round | undefined {
            return this.$store.getters.currentSubmissionRound;
        },
    }),

    async created (): Promise<void> {
        await this.getData();
    },

    methods: {
        async getData (): Promise<void> {
            const { data: submissions } = await this.$http.get<Submission[]>('/api/submissions');
            this.submissions = submissions;

            if (!this.rounds.length)  {
                await this.$store.dispatch(UPDATE_ROUNDS, this.standardContest.id);
            }
        },

        async save (e: Event): Promise<void> {
            if (!this.oszFile) {
                this.$store.dispatch('addToastMessage', 'Select an .osz');

                return;
            }

            (e?.target as HTMLInputElement).disabled = true;
            this.isSaving = true;
            const formData = new FormData();
            formData.append('oszFile', this.oszFile);

            await this.$http.post('/api/submissions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).finally(() => {
                this.isSaving = false;
                (e?.target as HTMLInputElement).disabled = false;
            });

            await this.getData();
        },

        uploadFile (e: any) {
            this.oszFile = e.target?.files?.[0];
        },
    },

});
</script>
