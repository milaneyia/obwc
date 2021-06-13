<template>
    <div class="table-responsive">
        <table
            class="table table-hover mb-0"
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
                            :item="item"
                            :index="i"
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
import { DateFormat } from '../formatDate';

export interface Field {
    key: string;
    label: string;
    formatter?: ((value: any) => string) | DateFormat;
}

export default defineComponent({
    name: 'DataTable',

    props: {
        customClass: {
            type: String,
            default: '',
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
                    if (!value) value = '';

                    if (typeof h.formatter === 'string') {
                        value = this.$formatDate(value, h.formatter);
                    } else {
                        value = h.formatter(value);
                    }
                }

                return {
                    header: h.key,
                    value,
                };
            });
        },
    },
});
</script>
