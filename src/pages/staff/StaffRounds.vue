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
                            class="btn btn-sm btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#roundUpdate"
                            @click="selectedRound = round"
                        >
                            Edit
                        </button>
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
                { key: 'submissionsStartedAt', label: 'Submissions Start', formatter: this.shortDateTimeString },
                { key: 'submissionsEndedAt', label: 'Submissions End', formatter: this.shortDateTimeString },
                { key: 'judgingStartedAt', label: 'Judging Start', formatter: this.shortDateTimeString },
                { key: 'judgingEndedAt', label: 'Judging End', formatter: this.shortDateTimeString },
                { key: 'resultsAt', label: 'Results', formatter: this.shortDateTimeString },
                { key: 'judgeToRounds', label: 'Judges', formatter: this.formatJudges },
                { key: 'songs', label: 'Songs', formatter: this.formatSongs },
            ] as Field[],
            rounds: [] as Round[],
            selectedRound: null as Round | null,
        };
    },

    async created () {
        const { data } = await this.$http.get(`/api/staff/contests/${this.$route.params.id}/rounds`);
        this.rounds = data;
    },

    methods: {
        formatJudges (judgeToRounds: CreateJudgeToRound[]): string {
            return judgeToRounds.map(j => j.user.username).join(', ');
        },

        formatSongs (songs: CreateSong[]): string {
            return songs.map(s => s.title).join(', ');
        },

        shortDateTimeString (value: string) {
            if (!value) return '';

            return new Date(value).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric' });
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
