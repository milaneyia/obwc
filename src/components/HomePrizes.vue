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

        <div class="card-body d-flex align-items-end">
            <div class="row row-cols-1 row-cols-xxl-2 g-4">
                <div
                    v-for="(prize, i) in prizes"
                    :key="i"
                    class="col"
                >
                    <div
                        class="card card-body text-dark flex-row text-center justify-content-around align-items-center py-4 px-1 h-100 rounded-3 prize fw-bold"
                        :style="prize.bg"
                        :class="prize.text"
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

                        <div v-else class="prize__players text-start text-vertical fs-1">
                            <div>
                                PLAYERS'
                            </div>
                            <div>PICK</div>
                        </div>

                        <div
                            class="border mx-2 align-self-stretch"
                            :class="i === 0 ? 'border-dark' : 'border-white'"
                        />

                        <div class="prize__detail w-100">
                            <div class="prize__badge" :class="i === 0 ? 'prize__badge--black' : ''" />
                            <div class="my-2">
                                <i class="fas fa-plus fa-2x" />
                            </div>
                            <div>(TBS) MONTHS</div>
                            <div>OSU!SUPPORTER</div>
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
                { bg: 'background-color: #facb5b', text: 'text-dark', sup: 'st' },
                { bg: 'background-color: #3bbce1', text: 'text-white', sup: 'nd' },
                { bg: 'background-color: #5c5c5c', text: 'text-white', sup: 'rd' },
                { bg: 'background-color: #9188c2', text: 'text-white' },
            ],
        };
    },
});
</script>

<style lang="scss">

.text-vertical {
    writing-mode: vertical-rl;
}

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
    }
}

</style>
