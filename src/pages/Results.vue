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
                                <!-- <div v-if="round && new Date() >= new Date(round.resultsAt) && round.downloadLink" class="row">
                                    <div class="col-sm">
                                        <div class="card">
                                            <div class="card-header">
                                                DOWNLOAD
                                            </div>
                                            <div class="card-body">
                                                <a
                                                    href="#"
                                                    target="_blank"
                                                >
                                                    <i class="fas fa-download"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card">
                                            <div class="card-header">
                                                JUDGING
                                            </div>
                                            <div class="card-body">
                                                <a
                                                    class="me-2"
                                                    href="#"
                                                    @click.prevent="judgingType = 1"
                                                >
                                                    mapper
                                                </a>
                                                <a
                                                    href="#"
                                                    @click.prevent="judgingType = 2"
                                                >
                                                    player
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card">
                                            <div class="card-header">
                                                ROUND
                                            </div>
                                            <div class="card-body">
                                                <div v-for="i in 4" :key="i">
                                                    {{ i }}
                                                </div>
                                                <div>ALL</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-sm">
                                        <div class="card">
                                            <div class="card-header">
                                                DISPLAY
                                            </div>
                                            <div class="card-body">
                                                <a
                                                    href="#"
                                                    :class="displayMode === 'criterias' ? 'border-bottom border-secondary' : ''"
                                                    @click.prevent="displayMode = 'criterias'"
                                                >
                                                    Per criteria
                                                </a>
                                                |
                                                <a
                                                    href="#"
                                                    :class="displayMode === 'judges' ? 'border-bottom border-secondary' : ''"
                                                    @click.prevent="displayMode = 'judges'"
                                                >
                                                    Per judge
                                                </a>
                                                |
                                                <a
                                                    href="#"
                                                    :class="displayMode === 'detail' ? 'border-bottom border-secondary' : ''"
                                                    @click.prevent="displayMode = 'detail'"
                                                >
                                                    Std detail
                                                </a>
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
import { JUDGING_TYPE } from '../../shared/models';
import Leaderboard from '../components/Leaderboard.vue';

export type DisplayMode = 'criterias' | 'judges' | 'detail';

export default defineComponent({
    name: 'Results',

    components: {
        Leaderboard,
    },

    data () {
        return {
            judgingType: JUDGING_TYPE.Mappers,
            displayMode: 'criterias' as DisplayMode,
        };
    },
});
</script>
