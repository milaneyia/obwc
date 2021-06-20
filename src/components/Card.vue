<template>
    <div class="card fs-sm border border-purple mb-2 card-schedule">
        <div class="card-header text-center bg-purple p-0 fw-bold">
            {{ title }}
        </div>

        <div class="card-body d-flex justify-content-center">
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