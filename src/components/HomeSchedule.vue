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
            <div
                v-for="(round, i) in schedule.rounds"
                :key="i"
                class="card fs-sm border border-yellow mb-2 card-schedule"
            >
                <div class="card-header text-center bg-yellow text-dark p-0 fw-bold">
                    {{ round.title }}
                </div>

                <div class="card-body d-flex flex-column px-3 py-0">
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
                </div>
                <div class="card-body d-flex flex-column px-3 py-0">
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
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center fs-sm mb-2 px-3 py-0">
                <div>RESULTS ANNOUNCEMENT + LIVESTREAM</div>
                <time-string div :timestamp="schedule.results" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Contest, Round } from '../../shared/models';
import TimeString from './TimeString.vue';

interface Schedule {
    announcement: Date | null,
    registration: [Date, Date],
    rounds: { title: string, mapping: [Date, Date], judging: [Date, Date] }[],
    results: Date | null,
}

export default defineComponent({
    name: 'HomeSchedule',
    components: { TimeString },

    data () {
        return {
            schedule: null as Schedule | null,
        };
    },

    async created () {
        const { data: contests } = await this.$http.get<Contest[]>('/api/contests');
        const standard = contests.find(c => c.id === 1);

        if (standard) {
            const { data: rounds } = await this.$http.get<Round[]>(`/api/contests/${standard.id}/rounds`);

            this.schedule = {
                announcement: standard.announcementAt,
                registration: [standard.registrationStartedAt, standard.registrationEndedAt],
                rounds: rounds.map(r => ({
                    title: this.numberToOrdinal(r.id) + ' ROUND',
                    mapping: [r.submissionsStartedAt, r.submissionsEndedAt],
                    judging: [r.judgingStartedAt, r.judgingEndedAt],
                })),
                results: rounds[rounds.length - 1].resultsAt,
            };
        }
    },

    methods: {
        numberToOrdinal (id: number): string {
            switch (id) {
                case 1:
                    return 'FIRST';
                case 2:
                    return 'SECOND';
                case 3:
                    return 'THIRD';
                case 4:
                    return 'FORTH';
                case 5:
                    return 'FIFTH';
                default:
                    return id.toString();
            }
        },
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
    font-size: 0.85rem;
}
.fs-xs {
    font-size: 0.75rem;
}

</style>
