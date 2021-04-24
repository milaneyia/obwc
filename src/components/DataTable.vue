<template>
    <div class="card-body p-0 table-responsive">
        <table
            class="table table-hover"
            :class="customClass"
        >
            <thead>
                <tr>
                    <th v-for="header in formattedHeaders" :key="header.key">
                        {{ header.label }}
                    </th>
                    <th v-if="$slots.actions">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, i) in items"
                    :key="'item-' + i"
                >
                    <td
                        v-for="(formattedValues, j) in formatItem(item)"
                        :key="'value-' + j"
                    >
                        <slot
                            v-if="$slots['cell-' + formattedValues.header]"
                            :name="'cell-' + formattedValues.header"
                            :value="formattedValues.value"
                        />
                        <span v-else>{{ formattedValues.value }}</span>
                    </td>

                    <td v-if="$slots.actions">
                        <slot name="actions" :item="item" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface Field {
    key: string;
    label: string;
    formatter?: (value: any) => string;
}

export default defineComponent({
    name: 'DataTable',

    props: {
        headers: {
            type: Array as PropType<string[]>,
            default: null,
        },
        customClass: {
            type: String,
            default: 'table-bordered',
        },
        fields: {
            type: Array as PropType<(Field | string)[]>,
            default: () => [],
        },
        items: {
            type: Array as PropType<any[]>,
            required: true,
        },
    },

    computed: {
        formattedHeaders (): Field[] {
            if (this.headers) {
                return this.headers.map(h => ({
                    key: h,
                    label: h,
                }));
            }

            if (this.fields.length) {
                return this.fields.map(f => {
                    if (typeof f === 'string') {
                        return {
                            key: f,
                            label: f,
                        };
                    }

                    return {
                        key: f.key,
                        label: f.label || f.key,
                        formatter: f.formatter,
                    };
                });
            }

            if (this.items.length) {
                return Object.keys(this.items[0]).map(k => ({
                    key: k,
                    label: k,
                }));
            }

            return [];
        },
    },

    methods: {
        formatItem (item: any) {
            return this.formattedHeaders.map(h => {
                let value = item[h.key];

                if (h.formatter) {
                    value = h.formatter(value);
                }

                return {
                    header: h,
                    value,
                };
            });
        },
    },
});
</script>
