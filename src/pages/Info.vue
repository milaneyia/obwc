<template>
    <div class="container-fluid">
        <div class="row mb-5">
            <div class="col">
                <div class="card card-section">
                    <div class="card-header">
                        <div class="card-header-back">
                            Information
                        </div>

                        <div class="card-header-sub">
                            <div class="card-header-title">
                                INFORMATION
                            </div>
                        </div>
                    </div>

                    <div class="card-body" v-html="$md.render(docs)" />
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
