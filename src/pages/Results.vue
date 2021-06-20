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
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                MODE
                                            </div>

                                            <div class="card-body d-flex justify-content-center px-3">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <mode-button
                                                    v-for="contest in contests"
                                                    :key="contest.id"
                                                    :contest="contest"
                                                    :selected="selectedContest?.id === contest.id"
                                                    @changeSelected="c => selectedContest = c"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                DOWNLOAD
                                            </div>

                                            <div class="card-body d-flex justify-content-center">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <a
                                                    class="btn btn-outline-light btn-save py-2 px-3"
                                                    @click.prevent=""
                                                >
                                                    <i class="fa fa-save" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                JUDGING
                                            </div>
                                            <div class="card-body">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
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
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                ROUND
                                            </div>
                                            <div class="card-body d-flex justify-content-center px-3">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <a
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="btn btn-round btn-outline-light mx-1"
                                                    :class="(activeRound == i) ? 'active' : ''"
                                                    @click.prevent="activeRound = i"
                                                >
                                                    {{ i }}
                                                </a>
                                                <a
                                                    class="btn btn-round btn-outline-light mx-1"
                                                    :class="(activeRound == 0) ? 'active' : ''"
                                                    @click.prevent="activeRound = 0"
                                                >
                                                    ALL
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                DISPLAY
                                            </div>
                                            <div class="card-body d-flex justify-content-center">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
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
                                            </div>
                                        </div>
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

import { Contest } from '../../shared/models';

export type DisplayMode = 'criterias' | 'judges' | 'detail';

export default defineComponent({
    name: 'Results',

    components: {
        Leaderboard,
        ModeButton,
    },

    data () {
        return {
            judgingType: JUDGING_TYPE.Mappers,
            displayMode: 'criterias' as DisplayMode,
            selectedContest: null as Contest | null,
            activeRound: 1,
        };
    },

    computed: {
        ...mapState({
            contests: (state: any) => state.contests as Contest[],
        }),
    },

    created() {
        this.selectedContest = this.contests[0];
    },
});
</script>

<style lang="scss" scoped>
.card-body {
    position:relative;
}

.card-body .fa-plus {
    position: absolute;
    padding: 10px;
    font-size: 0.5rem;

    &:nth-child(1) {
        top:0;
        left:0;
    }

    &:nth-child(2) {
        top:0;
        right:0;
    }

    &:nth-child(3) {
        bottom:0;
        left:0;
    }

    &:nth-child(4) {
        bottom:0;
        right:0;
    }
}

.icon-placeholder {
    width: 24px;
    height: 24px;
}

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

    transition: rotate 0.15s ease-in-out;

    &.mapper {
        rotate: 0deg;
    }
    &.player {
        rotate: 60deg;
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
        color: white;
        font-size: 1.5rem;
        transition: color 0.15s ease-in-out;
    }

    & li a.active {
        text-transform: uppercase;
        text-decoration: none;
        color: #facb5b;
    }

    & li a:before {
        content: '\2014';
        position: absolute;
        margin-left: -20px;
    }
}
</style>