<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table
                    :fields="fields"
                    :items="rounds"
                >
                    <template #actions="{ item: round }">
                        <button
                            class="btn btn-sm btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#roundUpdate"
                            @click="selectedRound = round"
                        >
                            Edit
                        </button>
                        <router-link class="btn btn-sm btn-link me-2" :to="{ name: 'staff-submissions', params: { id: round.id } }">
                            Submissions
                        </router-link>
                        <router-link class="btn btn-sm btn-link" :to="{ name: 'staff-judging', params: { id: round.id } }">
                            Judging
                        </router-link>
                    </template>
                </data-table>
            </div>
        </div>

        <staff-round-update
            id="roundUpdate"
            :round-prop="selectedRound"
            @update:round="update($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CreateJudgeToRound, CreateSong } from '../../../shared/integration';
import { Round } from '../../../shared/models';
import DataTable, { Field } from '../../components/DataTable.vue';
import StaffRoundUpdate from '../../components/StaffRoundUpdate.vue';
import { DateFormat } from '../../formatDate';

export default defineComponent({
    name: 'StaffRounds',

    components: {
        DataTable,
        StaffRoundUpdate,
    },

    data () {
        return {
            fields: [
                'id',
                { key: 'submissionsStartedAt', label: 'Submissions Start', formatter: DateFormat.Locale },
                { key: 'submissionsEndedAt', label: 'Submissions End', formatter: DateFormat.Locale },
                { key: 'judgingStartedAt', label: 'Judging Start', formatter: DateFormat.Locale },
                { key: 'judgingEndedAt', label: 'Judging End', formatter: DateFormat.Locale },
                { key: 'resultsAt', label: 'Results', formatter: DateFormat.Locale },
                { key: 'judgeToRounds', label: 'Judges', formatter: this.formatJudges },
                { key: 'songs', label: 'Songs', formatter: this.formatSongs },
                { key: 'downloadLink', label: 'Download All Link' },
            ] as Field[],

            rounds: [] as Round[],
            selectedRound: null as Round | null,
        };
    },

    async created () {
        const { data } = await this.$http.get(`/api/contests/${this.$route.params.id}/rounds`);
        this.rounds = data;
    },

    methods: {
        formatJudges (judgeToRounds: CreateJudgeToRound[]): string {
            return judgeToRounds.map(j => j.user.username).join(', ');
        },

        formatSongs (songs: CreateSong[]): string {
            return songs.map(s => s.title).join(', ');
        },

        update (round: Round) {
            const i = this.rounds.findIndex(r => r.id === round.id);

            if (i !== -1) {
                this.rounds[i] = round;
            }
        },
    },
});
</script>
