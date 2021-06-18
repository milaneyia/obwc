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

                                            <div class="card-body d-flex justify-content-between px-3">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <a
                                                    class="btn btn-mode btn-yellow py-3 px-1 osu"
                                                    @click.prevent=""
                                                >
                                                    <div class="icon-placeholder" />
                                                </a>
                                                <a
                                                    class="btn btn-mode btn-outline-light py-3 px-1 taiko"
                                                    @click.prevent=""
                                                >
                                                    <div class="icon-placeholder" />
                                                </a>
                                                <a
                                                    class="btn btn-mode btn-outline-light py-3 px-1 mania"
                                                    @click.prevent=""
                                                >
                                                    <div class="icon-placeholder" />
                                                </a>
                                                <a
                                                    class="btn btn-mode btn-outline-light py-3 px-1 catch"
                                                    @click.prevent=""
                                                >
                                                    <div class="icon-placeholder" />
                                                </a>
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
                                                    class="btn btn-outline-light btn-save py-3 px-3"
                                                    @click.prevent=""
                                                >
                                                    <i class="fa fa-save" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        <div class="card fs-sm border border-purple mb-2 card-schedule">
                                            <div class="card-header text-center bg-purple p-0 fw-bold">
                                                ROUND
                                            </div>
                                            <div class="card-body d-flex justify-content-between px-3">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <a
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="btn btn-round btn-outline-light"
                                                    @click.prevent=""
                                                >
                                                    {{ i }}
                                                </a>
                                                <a
                                                    class="btn btn-round btn-outline-light"
                                                    @click.prevent=""
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
                                            <div class="card-body">
                                                <i
                                                    v-for="i in 4"
                                                    :key="i"
                                                    class="fas fa-plus"
                                                />
                                                <ul class="display-mode">
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
    border: 3px solid white;
}

.btn-mode {
    background-repeat: no-repeat;
    background-position: center;
    background-size: 24px 24px;
}

.osu {
    &.btn-outline-light {
        background-image: url('../assets/osu-w.png');
    }

    &.btn-outline-light:hover {
        background-image: url('../assets/osu-b.png');
    }

    &.btn-yellow {
        background-image: url('../assets/osu-b.png');
    }
}

.taiko {
    &.btn-outline-light {
        background-image: url('../assets/taiko-w.png');
    }

    &.btn-outline-light:hover {
        background-image: url('../assets/taiko-b.png');
    }

    &.btn-yellow {
        background-image: url('../assets/taiko-b.png');
    }
}

.mania {
    &.btn-outline-light {
        background-image: url('../assets/mania-w.png');
    }

    &.btn-outline-light:hover {
        background-image: url('../assets/mania-b.png');
    }

    &.btn-yellow {
        background-image: url('../assets/mania-b.png');
    }
}

.catch {
    &.btn-outline-light {
        background-image: url('../assets/catch-w.png');
    }

    &.btn-outline-light:hover {
        background-image: url('../assets/catch-b.png');
    }

    &.btn-yellow {
        background-image: url('../assets/catch-b.png');
    }
}

.btn-save {
    border: 2px dotted #facb5b;
}

.btn-round {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 3rem;
    width: 3rem;
    font-weight: 600;
}

.display-mode {
    list-style-type: none;

    & li a {
        text-transform: uppercase;
        text-decoration: none;
        color: white;
        font-size: 1.5rem;
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