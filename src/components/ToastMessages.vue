<template>
    <div class="position-fixed bottom-0 w-100" style="z-index: 1090">
        <div class="position-relative">
            <div class="toast-container position-absolute bottom-0 start-50 translate-middle-x p-3">
                <transition-group name="component-fade">
                    <div
                        v-for="(toast, i) in toastMessages"
                        :key="i"
                        class="toast show d-flex align-items-center"
                        :class="getToastTypeClass(toast)"
                        data-bs-autohide="true"
                    >
                        <div class="toast-body">
                            {{ toast.message }}
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
export default defineComponent({
    computed: mapState({
        toastMessages: (state: any) => state.toasts.toastMessages,
    }),

    methods: {
        getToastTypeClass(toast): string {
            if (toast.type === 'success') return 'bg-success';
            if (toast.type === 'info') return 'bg-info';

            return 'bg-danger';
        },
    },
});
</script>
