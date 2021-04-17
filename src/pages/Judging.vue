<template>
    <div class="container-fluid">
        <div
            v-if="currentRound"
            class="row"
        >
            <div class="col-md-8">
                <judging-table />
            </div>

            <div class="col-md-4">
                <judging-scoring />
            </div>
        </div>

        <div v-else>
            Judging hasn't started or just ended or i fucked up, ops
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { Round, User } from '../../shared/models';
import JudgingScoring from '../components/JudgingScoring.vue';
import JudgingTable from '../components/JudgingTable.vue';
import { INIT_DATA } from '../store/judging-types';

export default defineComponent({
    components: {
        JudgingTable,
        JudgingScoring,
    },

    computed: mapState({
        user: (state: any) => state.loggedInUser as User,
        currentRound: (state: any) => state.judging.currentRound as Round | null,
    }),

    async created (): Promise<void> {
        await this.$store.dispatch('judging/' + INIT_DATA);
    },
});
</script>
