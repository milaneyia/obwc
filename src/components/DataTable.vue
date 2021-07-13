<template>
    <div class="table-responsive">
        <table
            class="table table-hover mb-0"
            :class="customClass"
        >
            <thead>
                <tr>
                    <th
                        v-for="header in formattedHeaders"
                        :key="header.key"
                    >
                        <a
                            v-if="header.sortable"
                            href="#"
                            class="d-flex align-items-center"
                            @click.prevent="sort(header.key)"
                        >
                            {{ header.label }}
                            <i
                                v-if="sortKey === header.key"
                                class="fas ms-1"
                                :class="getSortIcon()"
                            />
                        </a>

                        <span v-else>
                            {{ header.label }}
                        </span>
                    </th>
                    <th v-if="$slots.actions">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, i) in sortedItems"
                    :key="'item-' + i"
                    :class="item.rowClasses || ''"
                    @click="$emit('rowClick', item)"
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

                <slot name="custom-rows" />
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
    sortable?: boolean;
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

    emits: [
        'rowClick',
    ],

    data () {
        return {
            sortKey: '',
            sortAsc: false,
        };
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
                        sortable: f.sortable,
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

        sortedItems (): any[] {
            if (!this.sortKey) {
                return this.items;
            }

            return [...this.items].sort((a, b) => {
                let valueA = a[this.sortKey];
                let valueB = b[this.sortKey];

                if (typeof valueA === 'number') {
                    if (this.sortAsc)
                        return valueA - valueB;

                    return valueB - valueA;
                }

                if (typeof valueA === 'string') {
                    valueA = valueA.toUpperCase();
                    valueB = valueB.toUpperCase();

                    if (valueA < valueB) return this.sortAsc ? 1 : -1;
                    if (valueA > valueB) return this.sortAsc ? -1 : 1;

                    return 0;
                }

                if (valueA === valueB) return 0;

                if (this.sortAsc) {
                    return valueA ? 1 : -1;
                }

                return valueA ? -1 : 1;
            });
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

        sort (headerKey: string) {
            if (this.sortKey === headerKey) {
                this.sortAsc = !this.sortAsc;
            } else {
                this.sortAsc = false;
                this.sortKey = headerKey;
            }
        },

        getSortIcon () {
            if (this.sortAsc) {
                return 'fa-caret-down';
            }

            return 'fa-caret-up';
        },
    },
});
</script>
