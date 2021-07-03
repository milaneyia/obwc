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

                    <template v-if="currentRound && !(eliminationDetails.mappingEliminated && eliminationDetails.playerEliminated)">
                        <hr>

                        <div class="row mb-3">
                            <div class="col-sm">
                                <p class="text-center">
                                    You have from <b><time-string :timestamp="currentRound.submissionsStartedAt" /></b> to
                                    <b><time-string :timestamp="currentRound.submissionsEndedAt" /></b> to submit your entry
                                </p>

                                <hr>

                                <div v-if="currentRound.songs && currentRound.songs.length" class="text-center">
                                    <p v-for="song in currentRound.songs" :key="song">
                                        <a :href="song.link" target="_blank">
                                            {{ song.title }}

                                            <i class="fas fa-file-download" />
                                        </a>
                                    </p>
                                </div>

                                <hr>

                                <textarea
                                    v-model="information"
                                    class="form-control mb-2"
                                    rows="5"
                                    placeholder="Add details on how people participated on this entry"
                                />

                                <div>
                                    <label for="oszFile" class="form-label">.osz File (30Mb max)</label>
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
import { Contest, EliminationDetails, Round, Submission, User } from '../../shared/models';
import DataTable, { Field } from '../components/DataTable.vue';
import TimeString from '../components/TimeString.vue';
import { DateFormat } from '../formatDate';
import { UPDATE_ROUNDS } from '../store/main-types';

export default defineComponent({
    components: {
        DataTable,
        TimeString,
    },

    data () {
        return {
            submissions: [] as Submission[],
            eliminationDetails: { mappingEliminated: true, playerEliminated: true } as EliminationDetails,
            oszFile: null as File | null,
            information: '',
            isSaving: false,

            fields: [
                { key: 'round', label: 'Round', formatter: (round: Round) => round.id },
                { key: 'updatedAt', label: 'Update Date', formatter: DateFormat.Locale },
            ] as Field[],
        };
    },

    computed: {
        ...mapState({
            user: (state: any) => state.loggedInUser as User,
            rounds: (state: any) => state.rounds as Round[],
        }),

        standardContest (): Contest {
            return this.$store.getters.standardContest;
        },

        currentRound (): Round | undefined {
            return this.$store.getters.currentSubmissionRound;
        },

        currentSubmission (): Submission | undefined {
            return this.submissions.find(s => s.round.id === this.currentRound?.id);
        },
    },

    async created (): Promise<void> {
        await this.getData();
        this.information = this.currentSubmission?.information || '';
    },

    methods: {
        async getData (): Promise<void> {
            const [
                { data: submissions },
                { data: eliminationDetails },
            ] = await Promise.all([
                this.$http.get<Submission[]>('/api/submissions'),
                this.$http.get<EliminationDetails>('/api/submissions/check'),
            ]);

            this.submissions = submissions;
            this.eliminationDetails = eliminationDetails;

            if (!this.rounds.length)  {
                await this.$store.dispatch(UPDATE_ROUNDS, this.standardContest.id);
            }
        },

        async save (e: Event): Promise<void> {
            if (!this.oszFile) {
                this.$store.dispatch('addToastMessage', 'Select an .osz');

                return;
            }

            if (!this.information) {
                this.$store.dispatch('addToastMessage', 'Add details about your entry');

                return;
            }

            this.$store.dispatch('addToastMessage', {
                type: 'info',
                message: 'This may take a couple of minutes',
            });

            (e?.target as HTMLInputElement).disabled = true;
            this.isSaving = true;
            const formData = new FormData();
            formData.append('oszFile', this.oszFile);
            formData.append('information', this.information);

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
