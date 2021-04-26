<template>
    <div class="card card-section h-100">
        <div class="card-header">
            <div class="card-header-back">
                <img src="../assets/home_schedule.png">
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

        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center fs-sm mb-2 px-3 py-0">
                <div>SOME PHASE</div>
                <div>01-01-2020</div>
            </div>
            <div class="d-flex justify-content-between align-items-center fs-sm border border-yellow rounded-3 mb-2 px-3 py-0">
                <div>SOME PHASE</div>
                <div>
                    <div class="d-flex justify-content-between align-items-center ">
                        <div class="fs-xs text-yellow">
                            START
                        </div>
                        <div class="ms-3">
                            01-01-2020
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center ">
                        <div class="fs-xs text-yellow">
                            END
                        </div>
                        <div class="ms-3">
                            01-01-2020
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-for="i in 4"
                :key="i"
                class="card fs-sm border border-yellow mb-2 card-schedule"
            >
                <div class="card-header text-center bg-yellow text-dark p-0">
                    FIRST ROUND
                </div>

                <div class="card-body d-flex flex-column px-3 py-0">
                    <div
                        v-for="j in 2"
                        :key="j"
                        class="d-flex justify-content-between align-items-center border-yellow"
                        :class="j % 2 ? 'border-bottom-dashed' : ''"
                    >
                        <div>SOME PHASE</div>
                        <div>
                            <div class="d-flex justify-content-between align-items-center ">
                                <div class="fs-xs text-yellow">
                                    START
                                </div>
                                <div class="ms-3">
                                    01-01-2020
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center ">
                                <div class="fs-xs text-yellow">
                                    END
                                </div>
                                <div class="ms-3">
                                    01-01-2020
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center fs-sm mb-2 px-3 py-0">
                <div>SOME PHASE</div>
                <div>01-01-2020</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeSchedule',
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
