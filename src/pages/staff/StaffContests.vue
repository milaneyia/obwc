<template>
    <div class="container">
        <div class="row">
            <div class="col-sm">
                <data-table
                    :items="contests"
                    :headers="['name', 'isOpen']"
                >
                    <template #actions="{ item: contest }">
                        <button
                            class="btn btn-sm btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#contestUpdate"
                            @click="selectedContest = contest"
                        >
                            Edit
                        </button>
                    </template>
                </data-table>
            </div>
        </div>

        <staff-contest-update
            id="contestUpdate"
            :contest="selectedContest"
            @update:contest="update($event)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Contest } from '../../../shared/models';
import DataTable from '../../components/DataTable.vue';
import StaffContestUpdate from '../../components/StaffContestUpdate.vue';

export default defineComponent({
    components: {
        DataTable,
        StaffContestUpdate,
    },

    data () {
        return {
            contests: [] as Contest[],
            selectedContest: null as Contest | null,
        };
    },

    async created () {
        const { data } = await this.$http.get('/api/staff/contests');
        this.contests = data;
    },

    methods: {
        update (contest: Contest) {
            const i = this.contests.findIndex(c => c.id === contest.id);

            if (i !== -1) {
                this.contests[i] = contest;
            }
        },
    },
});
</script>
