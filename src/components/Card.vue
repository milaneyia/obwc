<template>
    <div class="card" :class="cardClass">
        <div class="card-header" :class="headerClass">
            {{ title }}
        </div>

        <div class="card-body" :class="bodyClass">
            <div v-if="plus" class="card-body--plus">
                <i
                    v-for="i in 4"
                    :key="i"
                    class="fas fa-plus"
                />
            </div>
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true,
        },

        plus: {
            type: Boolean,
            default: false,
        },

        cardClass: {
            type: Array,
            default: (): string[] => { return ['fs-sm', 'border', 'border-purple', 'mb-2', 'card-schedule']; },
        },

        headerClass: {
            type: Array,
            default: (): string[] => { return ['text-center', 'bg-purple', 'p-0', 'fw-bold']; },
        },

        bodyClass: {
            type: Array,
            default: (): string[] => { return ['d-flex', 'justify-content-center']; },
        },
    },
};
</script>

<style lang="scss">
.card-body {
    position:relative;

    & .card-body--plus .fa-plus {
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
}
</style>