<template>
    <div class="card card-section h-100">
        <div class="card-header">
            <div class="card-header-back">
                Prizes
            </div>

            <div class="card-header-sub">
                <div class="card-header-title">
                    PRIZES
                </div>
                <div class="card-header-subtitle">
                    SUPPORTER TAGS ARE FOR EACH MEMBER
                </div>
            </div>
        </div>

        <div class="card-body d-flex">
            <div class="row row-cols-1 row-cols-xxl-2 g-4">
                <div
                    v-for="(prize, i) in prizes"
                    :key="i"
                    class="col"
                >
                    <div
                        class="card card-body text-dark text-center py-4 px-0 rounded-3 prize fw-bold h-100 justify-content-around"
                        :style="prize.bg"
                        :class="prize.text"
                    >
                        <div class="row align-items-center g-0">
                            <div
                                class="col-4 border-2 border-end h-100 d-flex justify-content-center align-items-center"
                                :class="i === 0 ? 'border-dark' : 'border-white'"
                            >
                                <div v-if="i < 3" class="prize__place">
                                    <img
                                        src="../assets/crown.png"
                                        class="img-fluid"
                                        style="max-height: 28px"
                                        :style="i !== 0 ? 'filter: invert(1)' : ''"
                                    >
                                    <div class="fs-1">
                                        {{ i + 1 }}<sup class="fs-3">{{ prize.sup }}</sup>
                                    </div>
                                    <div>PLACE</div>
                                </div>

                                <div v-else class="prize__players text-start fs-1">
                                    <div>
                                        PLAYERS'
                                    </div>
                                    <div>PICK</div>
                                </div>
                            </div>

                            <div class="col-8">
                                <div class="prize__detail w-100">
                                    <div class="prize__badge" :class="i === 0 ? 'prize__badge--black' : ''" />
                                    <div class="my-2">
                                        <i class="fas fa-plus fa-2x" />
                                    </div>
                                    <div>{{ prize.supporter }} MONTHS</div>
                                    <div>OSU!SUPPORTER</div>
                                </div>
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

export default defineComponent({
    name: 'HomePrizes',

    data () {
        return {
            prizes: [
                { supporter: 8, bg: 'background-color: #facb5b', text: 'text-dark', sup: 'st' },
                { supporter: 6, bg: 'background-color: #3bbce1', text: 'text-white', sup: 'nd' },
                { supporter: 4, bg: 'background-color: #5c5c5c', text: 'text-white', sup: 'rd' },
                { supporter: 2, bg: 'background-color: #9188c2', text: 'text-white' },
            ],
        };
    },
});
</script>

<style lang="scss">

.prize {
    min-height: 260px;

    &__badge {
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url('../assets/badge.png');
        max-width: 100%;
        min-width: 130px;
        min-height: 85px;

        &--black {
            background-image: url('../assets/badge_black.png');
        }
    }

    &__players {
        line-height: 0.8;
        writing-mode: vertical-rl;
    }
}

</style>
