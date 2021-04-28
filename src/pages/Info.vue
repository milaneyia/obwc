<template>
    <div class="container">
        <img
            class="img-fluid mx-auto d-block"
            src="../assets/banner.png"
            alt=""
        >

        <div class="row my-5">
            <div class="col-lg-5 mx-auto">
                <div class="d-flex justify-content-around flex-wrap">
                    <a
                        class="d-flex align-items-center mb-3 mb-sm-0"
                        href="https://discord.gg/CZp4bNx"
                        target="__blank"
                    >
                        <i class="fab fa-discord fa-2x" />
                        <h5 class="mx-3 mb-0">Join us!</h5>
                    </a>
                    <a
                        class="d-flex align-items-center mb-3 mb-sm-0"
                        href="https://twitter.com/osubwc"
                        target="__blank"
                    >
                        <i class="fab fa-twitter fa-2x" />
                        <h5 class="mx-3 mb-0">
                            Follow us!
                        </h5>
                    </a>
                </div>
            </div>
        </div>

        <div class="row my-5">
            <div class="col">
                <div class="card card-section card-body">
                    <div v-html="$md.render(docs)" />
                </div>
            </div>
        </div>

        <div class="row my-5">
            <div class="col text-center">
                <a
                    class="twitter-timeline"
                    data-width="600"
                    data-height="700"
                    data-dnt="true"
                    data-theme="dark"
                    href="https://twitter.com/osubwc?ref_src=twsrc%5Etfw"
                >
                    Tweets by osubwc
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import rawDoc from '../docs/official-documentation.md?raw';

export default defineComponent({
    name: 'Info',

    computed: {
        docs () {
            return rawDoc;
        },
    },
});
</script>
