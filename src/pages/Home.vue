<template>
    <div class="container-fluid px-sm-4">
        <div class="row gy-2">
            <div class="col-md-6 col-lg-3">
                <home-info />
            </div>

            <div class="col-md-6 col-lg-5">
                <home-prizes />
            </div>

            <div class="col-md-12 col-lg-4">
                <home-schedule />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeInfo from '../components/HomeInfo.vue';
import HomePrizes from '../components/HomePrizes.vue';
import HomeSchedule from '../components/HomeSchedule.vue';

export default defineComponent({
    name: 'Home',

    components: {
        HomeInfo,
        HomePrizes,
        HomeSchedule,
    },
});
</script>
