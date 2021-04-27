<template>
    <div
        v-if="div"
        v-bs-tooltip="tooltipDate"
    >
        {{ shortDateTimeString(timestamp) }}
    </div>
    <span
        v-else
        v-bs-tooltip="tooltipDate"
    >
        {{ shortDateTimeString(timestamp) }}
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { DateFormat } from '../formatDate';

export default defineComponent({
    name: 'TimeString',

    props: {
        timestamp: {
            type: [String, Date],
            required: true,
        },

        div: {
            type: Boolean,
        },

        format: {
            type: String,
            default: DateFormat.Date,
        },
    },

    computed: {
        tooltipDate (): string {
            return new Date(this.timestamp).toLocaleString('en-US', { timeZoneName: 'short' });
        },
    },

    methods: {
        shortDateTimeString (value: string) {
            if (!value) return '';

            return this.$formatDate(value, this.format as DateFormat);
        },
    },
});
</script>
