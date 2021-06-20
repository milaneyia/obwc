<template>
    <input
        :id="'mode-' + contest.id"
        type="radio"
        class="btn-check"
        autocomplete="off"
        :value="contest"
        :disabled="disabled"
        @click="changeSelected"
    >
    <label
        class="btn btn-mode-radio mx-1"
        :class="[selected ? 'active' : '', getContestIcon(contest.id)]"
        :for="'mode-' + contest.id"
    />
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core';
import { Contest, ContestMode } from '../../shared/models';
export default {
    props: {
        contest: {
            type: Object as PropType<Contest>,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['changeSelected'],
    methods: {
        getContestIcon (id: number): string {
            let className = 'btn-mode-radio--';

            switch (id) {
                case ContestMode.Standard:
                    return className + 'osu';
                case ContestMode.Taiko:
                    return className + 'taiko';
                case ContestMode.Catch:
                    return className + 'catch';
                case ContestMode.Mania:
                    return className + 'mania';
            }

            return 'btn-mode-radio';
        },
        changeSelected(): void {
            this.$emit('changeSelected', this.contest);
        },
    },
};
</script>

<style lang="scss">
.btn-mode-radio {
    color: var(--bs-white);
    border-color: var(--bs-white);
    border-width: 2px;

    &:hover, &.active {
        color: #000;
        background-color: #facb5b;
        border-color: #facb5b;
    }

    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px;

    padding: 1.25rem 0.8rem;

    @each $mode in 'osu', 'taiko', 'catch', 'mania' {
        &--#{$mode} {
            background-image: url('../assets/#{$mode}-w.png');
        }

        &--#{$mode}.active {
            background-image: url('../assets/#{$mode}-b.png');
        }
    }
}
</style>