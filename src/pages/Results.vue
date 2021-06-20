<template>
    <div class="container-fluid">
        <div class="row mb-5">
            <div class="col">
                <div class="card card-section">
                    <div class="card-header">
                        <div class="card-header-back">
                            Leaderboard
                        </div>

                        <div class="card-header-sub">
                            <div class="card-header-title">
                                LEADERBOARD
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-3">
                                <div class="row">
                                    <div class="col-sm-8">
                                        <card :title="'MODE'" :plus="true">
                                            <!-- TODO: need good disabled selector -->
                                            <mode-button
                                                v-for="contest in contests"
                                                :key="contest.id"
                                                :contest="contest"
                                                :selected="selectedContest?.id === contest.id"
                                                :disabled="!isDatePassed(contest.registrationEndedAt)"
                                                @changeSelected="c => selectedContest = c"
                                            />
                                        </card>
                                    </div>
                                    <div class="col-sm-4">
                                        <card :title="'DOWNLOAD'" :plus="true">
                                            <a
                                                class="btn btn-outline-light btn-save py-2 px-3"
                                                @click.prevent=""
                                            >
                                                <i class="fa fa-save" />
                                            </a>
                                        </card>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <card :title="'JUDGING'" :plus="true">
                                            <div class="d-flex justify-content-center">
                                                <div>
                                                    <img src="../assets/results-click-indicator.png" alt="Click Indicator">
                                                    <img
                                                        src="../assets/results-knob.png"
                                                        alt="Knob"
                                                        class="judging-knob"
                                                        :class="judgingType == 2 ? 'player' : 'mapper'"
                                                        @click.prevent="judgingType == 1 ? judgingType = 2 : judgingType = 1"
                                                    >
                                                </div>
                                                <div>
                                                    <ul>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                :class="judgingType === 1 ? 'active' : ''"
                                                                @click.prevent="judgingType = 1"
                                                            >
                                                                mapper
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                :class="judgingType === 2 ? 'active' : ''"
                                                                @click.prevent="judgingType = 2"
                                                            >
                                                                player
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </card>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <card :title="'ROUND'" :plus="true">
                                            <a
                                                v-for="round in rounds"
                                                :key="round.id"
                                                class="btn btn-round btn-outline-light mx-1"
                                                :class="[
                                                    { active: selectedRound == round},
                                                    { disabled: !isDatePassed(round.resultsAt) }
                                                ]"
                                                @click.prevent="selectedRound = round"
                                            >
                                                {{ isDatePassed(round.resultsAt) ? round.id : 'TBA' }}
                                            </a>
                                            <a
                                                class="btn btn-round btn-outline-light mx-1"
                                                :class="(selectedRound == null) ? 'active' : ''"
                                                @click.prevent="selectedRound = null"
                                            >
                                                ALL
                                            </a>
                                        </card>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <card :title="'DISPLAY'" :plus="true">
                                            <div>
                                                <ul>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            :class="displayMode === 'criterias' ? 'border-bottom border-secondary active' : ''"
                                                            @click.prevent="displayMode = 'criterias'"
                                                        >
                                                            Per criteria
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            :class="displayMode === 'judges' ? 'border-bottom border-secondary active' : ''"
                                                            @click.prevent="displayMode = 'judges'"
                                                        >
                                                            Per judge
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            :class="displayMode === 'detail' ? 'border-bottom border-secondary active' : ''"
                                                            @click.prevent="displayMode = 'detail'"
                                                        >
                                                            Std detail
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </card>
                                    </div>
                                </div>
                            </div>

                            <div class="col-lg-9">
                                <leaderboard
                                    class="h-100"
                                    :display-mode="displayMode"
                                    :judging-type="judgingType"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { JUDGING_TYPE } from '../../shared/models';
import Leaderboard from '../components/Leaderboard.vue';
import ModeButton from '../components/ModeButton.vue';
import Card from '../components/Card.vue';

import { Contest, Round } from '../../shared/models';

export type DisplayMode = 'criterias' | 'judges' | 'detail';

export default defineComponent({
    name: 'Results',

    components: {
        Leaderboard,
        ModeButton,
        Card,
    },

    data () {
        return {
            judgingType: JUDGING_TYPE.Mappers,
            displayMode: 'criterias' as DisplayMode,
            selectedContest: null as Contest | null,
            selectedRound: null as Round | null,
        };
    },

    computed: {
        ...mapState({
            contests: (state: any) => state.contests as Contest[],
            rounds: (state: any) => state.rounds as Round[],
        }),
    },

    created() {
        this.selectedContest = this.contests[0];
    },

    methods: {
        isDatePassed(date: Date | string) {
            if (typeof date === 'string')
                date = new Date(date);

            const now = new Date();

            return now.valueOf() - date.valueOf() > 0;
        },
    },
});
</script>

<style lang="scss" scoped>
.btn-outline-light {
    border: 3px solid var(--bs-white);

    &:hover, &.active {
        border: 3px solid var(--bs-yellow);
        background-color: var(--bs-yellow);
    }
}

.btn-save {
    border: 3px dotted var(--bs-yellow);
    font-size: 1rem;
}

.judging-knob {
    cursor: pointer;

    transition: transform 0.15s ease-in-out;

    &.mapper {
        transform: rotate(0deg);
    }
    &.player {
        transform: rotate(60deg);
    }
}

.btn-round {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 3rem;
    width: 3rem;
    font-weight: 600;
}

ul {
    display: inline-block;
    list-style-type: none;

    & li a {
        text-transform: uppercase;
        text-decoration: none;
        color: var(--bs-white);
        font-size: 1.5rem;
        transition: color 0.15s ease-in-out;
    }

    & li a.active {
        text-transform: uppercase;
        text-decoration: none;
        color: var(--bs-yellow);
    }

    & li a:before {
        content: '\2014';
        position: absolute;
        margin-left: -20px;
    }
}
</style>