<template>
    <div class="container">
        <div class="row mb-2">
            <div class="col-sm">
                <data-table
                    :items="logs"
                    :fields="fields"
                />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button class="btn btn-primary w-100" @click="showMore">
                    show more
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DataTable, { Field } from '../../components/DataTable.vue';
import { DateFormat } from '../../formatDate';
import { Log } from '../../../shared/models';

export default defineComponent({
    name: 'StaffLogs',

    components: {
        DataTable,
    },

    data () {
        return {
            logs: [] as Log[],
            page: 1,

            fields: [
                'text',
                'type',
                { key: 'createdAt', label: 'Date', formatter: DateFormat.Locale },
            ] as Field[],
        };
    },

    async created () {
        const { data } = await this.$http.get<Log[]>('/api/staff/logs');
        this.logs = data;
    },

    methods: {
        async showMore () {
            this.page++;
            const { data } = await this.$http.get<Log[]>('/api/staff/logs?page=' + this.page);

            if (!data.length) {
                this.$store.dispatch('addToastMessage', {
                    type: 'info',
                    message: 'No more data',
                });
            } else {
                this.logs.push(...data);
            }
        },
    },
});
</script>
