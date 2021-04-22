<template>
    <div class="card-body p-0">
        <table
            class="table table-hover"
            :class="customClass"
        >
            <thead>
                <tr>
                    <th v-for="header in formattedHeaders" :key="header">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, i) in items"
                    :key="'item-' + i"
                >
                    <td
                        v-for="(value, k, j) in item"
                        :key="'value-' + j"
                    >
                        {{ value }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'DataTable',

    props: {
        headers: {
            type: Array as PropType<string[]>,
            default: null,
        },
        customClass: {
            type: String,
            default: 'table-responsive-lg',
        },
        items: {
            type: Array as PropType<any[]>,
            required: true,
        },
    },

    computed: {
        formattedHeaders (): string[] {
            if (this.headers) {
                return this.headers;
            }

            if (this.items.length) {
                return Object.keys(this.items[0]);
            }

            return [];
        },
    },
});
</script>
