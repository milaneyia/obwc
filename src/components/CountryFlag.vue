<template>
    <div class="d-flex align-items-center">
        <div class="country-flag" :style="`background-image: url(https://osu.ppy.sh/images/flags/${country.code}.png)`" />
        <div class="ms-2">
            <span v-if="title">{{ title }}</span>
            <span v-else>{{ country.name }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Country } from '../../shared/models';

export default defineComponent({
    name: 'CountryFlag',

    props: {
        country: {
            type: Object as PropType<Country>,
            required: true,
        },

        title: {
            type: String,
            default: null,
        },
    },
});
</script>

<style lang="scss">

.country-flag {
    border-radius: 4px;
    height: 20px;
    width: 30px;
    min-width: 30px;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    display: inline-block;
}

</style>
