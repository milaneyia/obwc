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
                                    <div :class="downloadLink ? 'col-sm-8' : 'col-sm-12'">
                                        <card title="MODE" plus>
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
                                    <div
                                        v-if="downloadLink"
                                        class="col-sm-4"
                                    >
                                        <card title="DOWNLOAD" plus>
                                            <a
                                                class="btn btn-outline-light btn-save py-2 px-3"
                                                :href="downloadLink"
                                                target="_blank"
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
                                                        @click.prevent="selectJudgingType()"
                                                    >
                                                </div>
                                                <div>
                                                    <ul>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                :class="judgingType === 1 ? 'active' : ''"
                                                                @click.prevent="selectJudgingType(1)"
                                                            >
                                                                mapper
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                href="#"
                                                                :class="judgingType === 2 ? 'active' : ''"
                                                                @click.prevent="selectJudgingType(2)"
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
                                        <card title="ROUND" plus>
                                            <div class="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                                <a
                                                    v-for="round in rounds"
                                                    :key="round.id"
                                                    class="btn btn-round btn-outline-light"
                                                    :class="[
                                                        { active: selectedRound == round},
                                                        { disabled: !isDatePassed(round.resultsAt) }
                                                    ]"
                                                    @click.prevent="selectRound(round)"
                                                >
                                                    {{ isDatePassed(round.resultsAt) ? round.id : 'TBA' }}
                                                </a>
                                                <a
                                                    class="btn btn-round btn-outline-light"
                                                    :class="(selectedRound == null) ? 'active' : ''"
                                                    @click.prevent="selectRound()"
                                                >
                                                    ALL
                                                </a>
                                            </div>
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
                                    :display-mode="displayMode"
                                    :round="roundInfo"
                                    :criterias="criterias"
                                    :teams-scores="teamsScores"
                                    :judges-correl="judgesCorrel"
                                    :is-loading="isLoading"
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
import { Criteria, JUDGING_TYPE, User } from '../../shared/models';
import { Contest, Round } from '../../shared/models';
import { Results } from '../../shared/integration';
import { UPDATE_ROUNDS } from '../store/main-types';
import Leaderboard from '../components/Leaderboard.vue';
import ModeButton from '../components/ModeButton.vue';
import Card from '../components/Card.vue';
import { JudgeCorrel, TeamScore } from '../../api/helpers/results';

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
            judgingType: null as JUDGING_TYPE | null,
            displayMode: 'criterias' as DisplayMode,
            selectedContest: null as Contest | null,
            selectedRound: null as Round | null,

            roundInfo: null as Round | null,
            criterias: [] as Criteria[],
            teamsScores: [] as TeamScore[],
            judgesCorrel: [] as JudgeCorrel[],

            isLoading: true,
        };
    },

    computed: {
        ...mapState({
            loggedInUser: (state: any) => state.loggedInUser as User | null,
            contests: (state: any) => state.contests as Contest[],
            rounds: (state: any) => state.rounds as Round[],
        }),

        standardContest (): Contest {
            return this.$store.getters.standardContest;
        },

        downloadLink (): string | undefined {
            return this.selectedRound?.downloadLink;
        },
    },

    async created() {
        if (!this.rounds.length) {
            await this.$store.dispatch(UPDATE_ROUNDS, this.standardContest.id);
        }

        this.selectedContest = this.contests[0];
        const roundId = this.$route.query.round?.toString() || this.rounds[0].id;
        this.judgingType = this.$route.query.type ?
            parseInt(this.$route.query.type.toString()) :
            JUDGING_TYPE.Mappers;

        if (roundId && roundId !== 'all') {
            this.selectedRound = this.rounds.find(r => r.id == roundId) || null;
        }

        this.getResults();
    },

    methods: {
        async getResults () {
            this.isLoading = true;

            if (this.selectedRound) {
                const { data } = await this.$http.get<Results>(`/api/rounds/${this.selectedRound.id}/results?type=${this.judgingType}`);
                this.roundInfo = data.round;
                this.criterias = data.criterias;
                this.teamsScores = data.teamsScores;
                this.judgesCorrel = data.judgesCorrel;
            } else {
                let totalTeamsScores: TeamScore[] = [];
                let totalJudgesCorrel: JudgeCorrel[] = [];

                for (const round of this.rounds) {
                    const { data } = await this.$http.get<Results>(`/api/rounds/${round.id}/results?type=${this.judgingType}`);

                    // TODO: Temporal stuff, detail modal should separate by round
                    if (round.id === 1) {
                        this.roundInfo = data.round;
                        this.criterias = data.criterias;
                    }

                    if (!data.teamsScores.length) {
                        continue;
                    }

                    for (const score of data.teamsScores) {
                        if (score.isEliminated) {
                            continue;
                        }

                        const i = totalTeamsScores.findIndex(s => s.team.id === score.team.id);

                        if (i === -1) {
                            totalTeamsScores.push(score);
                            continue;
                        }

                        for (const criteriaSum of score.criteriaSum) {
                            const criteriaIndex = totalTeamsScores[i].criteriaSum.findIndex(c => c.criteriaId === criteriaSum.criteriaId);

                            if (criteriaIndex === -1) {
                                totalTeamsScores[i].criteriaSum.push(criteriaSum);
                                continue;
                            }

                            totalTeamsScores[i].criteriaSum[criteriaIndex].sum += criteriaSum.sum;
                        }

                        for (const judgingSum of score.judgingSum) {
                            const judgeIndex = totalTeamsScores[i].judgingSum.findIndex(j => j.judgeId === judgingSum.judgeId);

                            if (judgeIndex === -1) {
                                totalTeamsScores[i].judgingSum.push(judgingSum);
                                continue;
                            }

                            totalTeamsScores[i].judgingSum[judgeIndex].sum += judgingSum.sum;
                        }

                        totalTeamsScores[i].rawFinalScore += score.rawFinalScore;
                        totalTeamsScores[i].standardizedFinalScore += score.standardizedFinalScore;
                    }

                    this.judgesCorrel = data.judgesCorrel;
                }

                this.teamsScores = totalTeamsScores;
                this.judgesCorrel = totalJudgesCorrel;
            }

            this.isLoading = false;
        },

        isDatePassed (date: Date | string) {
            if (this.loggedInUser?.isStaff)
                return true;

            if (typeof date === 'string')
                date = new Date(date);

            const now = new Date();

            return now.valueOf() - date.valueOf() > 0;
        },

        selectRound (round?: Round) {
            if (round) {
                this.selectedRound = round;
                this.updateQueryUrl({ round: round.id.toString() });
            } else {
                this.selectedRound = null;
                this.updateQueryUrl({ round: 'all' });
            }

            this.getResults();
        },

        selectJudgingType (type?: JUDGING_TYPE) {
            if (!type) {
                this.judgingType = this.judgingType === JUDGING_TYPE.Mappers ? JUDGING_TYPE.Players : JUDGING_TYPE.Mappers;
            } else {
                this.judgingType = type;
            }

            this.updateQueryUrl({ type: this.judgingType });
            this.getResults();
        },

        updateQueryUrl (toUpdate: Record<string, any>) {
            this.$router.replace({
                query: {
                    ...this.$route.query,
                    ...toUpdate,
                },
            });
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