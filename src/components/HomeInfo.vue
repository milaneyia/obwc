<template>
    <div class="card card-section h-100">
        <div class="card-body d-flex flex-column justify-content-evenly">
            <div class="home-logo" />

            <div class="px-2">
                <div class="bg-white text-dark rounded-pill p-1 text-center fw-bold my-2">
                    MAY 02 - NOV 15
                </div>

                <a
                    class="box-link"
                    href="#"
                    target="_blank"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'HomeInfo',
});
</script>

<style lang="scss">

.home-logo {
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../assets/home_obwc.png');
    max-width: 100%;
    min-height: 500px;
    height: auto;
}

.box-link {
    display: block;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('../assets/home_link.png');
    max-width: 100%;
    min-height: 80px;
    height: auto;
    transition: background-image 0.2s ease-in-out;

    &:hover {
        background-image: url('../assets/home_link_hover.png');
    }
}

</style>
