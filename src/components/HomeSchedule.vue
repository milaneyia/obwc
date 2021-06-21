<template>
    <div class="card card-section h-100">
        <div class="card-header">
            <div class="card-header-back">
                Schedule
            </div>

            <div class="card-header-sub">
                <div class="card-header-title">
                    SCHEDULE
                </div>
                <div class="card-header-subtitle">
                    DATES ARE IN YOUR LOCAL TIMEZONE
                </div>
            </div>
        </div>

        <div v-if="schedule" class="card-body">
            <div class="d-flex justify-content-between align-items-center fs-sm mb-2 px-3 py-0">
                <div>OBWC ANNOUNCEMENT</div>
                <time-string div :timestamp="schedule.announcement" />
            </div>
            <div class="d-flex justify-content-between align-items-center fs-sm border border-yellow rounded-3 mb-2 px-3 py-0">
                <div>REGISTRATION PHASE</div>
                <div>
                    <div class="d-flex justify-content-between align-items-center ">
                        <div class="fs-xs text-yellow">
                            START
                        </div>
                        <div class="ms-3">
                            <time-string div :timestamp="schedule.registration[0]" />
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center ">
                        <div class="fs-xs text-yellow">
                            END
                        </div>
                        <div class="ms-3">
                            <time-string div :timestamp="schedule.registration[1]" />
                        </div>
                    </div>
                </div>
            </div>
            <card
                v-for="(round, i) in schedule.rounds"
                :key="i"
                :title="round.title"
                :card-class="['fs-sm', 'border', 'border-yellow', 'mb-2', 'card-schedule']"
                :header-class="['text-center', 'bg-yellow', 'text-dark', 'p-0', 'fw-bold']"
                :body-class="['d-flex', 'flex-column', 'px-3', 'py-0']"
            >
                <div class="d-flex justify-content-between align-items-center border-yellow border-bottom-dashed">
                    <div>MAPPING PHASE</div>
                    <div>
                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="fs-xs text-yellow">
                                START
                            </div>
                            <div class="ms-3">
                                <time-string div :timestamp="round.mapping[0]" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="fs-xs text-yellow">
                                END
                            </div>
                            <div class="ms-3">
                                <time-string div :timestamp="round.mapping[1]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between align-items-center border-yellow">
                    <div>JUDGING PHASE</div>
                    <div>
                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="fs-xs text-yellow">
                                START
                            </div>
                            <div class="ms-3">
                                <time-string div :timestamp="round.judging[0]" />
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center ">
                            <div class="fs-xs text-yellow">
                                END
                            </div>
                            <div class="ms-3">
                                <time-string div :timestamp="round.judging[1]" />
                            </div>
                        </div>
                    </div>
                </div>
            </card>
            <div v-if="schedule.results" class="d-flex justify-content-between align-items-center fs-sm mb-2 px-3 py-0">
                <div>RESULTS ANNOUNCEMENT + LIVESTREAM</div>
                <time-string div :timestamp="schedule.results" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Contest } from '../../shared/models';
import { Schedule } from '../store/main';
import { UPDATE_ROUNDS } from '../store/main-types';
import Card from './Card.vue';
import TimeString from './TimeString.vue';


export default defineComponent({
    name: 'HomeSchedule',

    components: { TimeString, Card },

    computed: {
        standardContest (): Contest {
            return this.$store.getters.standardContest;
        },

        schedule (): Schedule | undefined {
            return this.$store.getters.schedule;
        },
    },

    async created () {
        if (this.standardContest) {
            await this.$store.dispatch(UPDATE_ROUNDS, this.standardContest.id);
        }
    },
});
</script>

<style lang="scss">

.card-schedule {
    border-radius: .5rem;

    & > .card-header {
        border-radius: calc(0.5rem - 3px) calc(0.5rem - 3px) 0 0;
    }
}

.border-bottom-dashed {
    border-bottom-style: dashed;
    border-bottom-width: 2px;
}

.fs-sm {
    font-size: 0.9rem;
}
.fs-xs {
    font-size: 0.8rem;
}

</style>
