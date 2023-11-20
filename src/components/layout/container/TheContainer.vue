<template>
    <div class="container">
        <m-toast v-model:toasts="toasts"></m-toast>
        <div class="error-dialog-container" v-if="dialog.show">
            <m-modal>
                <m-dialog @onClose="closeDialog" :width="'424px'" :class="'no-footer-border'">
                    <template #body>
                        <div class="noti-content">
                            <span v-if="dialog.type===this.$enum.ToastType.WARNING" class="icon warning-icon"></span>
                            <span v-if="dialog.type===this.$enum.ToastType.ERROR" class="icon error-icon"></span>
                            <div class="error-messages-container">
                                <p v-for="msg in dialog.msg" :key="msg">
                                    {{ dialog.msg.length > 1 ? "- " + msg : msg }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <m-button :autofocus="true" :class="'left-align'" @click="closeDialog">{{
                            this.$message.form.buttons.CLOSE
                        }}</m-button>
                    </template>
                </m-dialog>
            </m-modal>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'TheContainer',
    data() {
        return {
            toasts: [],
            dialog: {}
        }
    },
    methods: {
        /**
         * Thêm toast mới vào mảng
         * Created by: dktuan (30/08/2023)
         */
        addToast(toast) {
            this.toasts = [...this.toasts, toast]
        },
        /**
         * Đóng dialog
         * Created by: dktuan (24/08/2023)
         */
        closeDialog() {
            this.dialog.show = false;
        },
        /**
         * Mở dialog thông báo lỗi
         * @param {Object} dialog 
         * Created by: dktuan (24/08/2023)
         */
        openErrorDialog(dialog) {
            this.dialog = dialog
        }
    },
    created() {
        this.$emitter.on('addToast', this.addToast)
        this.$emitter.on('openErrorDialog', this.openErrorDialog)

    },
    beforeUnmount() {
        this.$emitter.off('addToast', this.addToast)
    }
}
</script>

<style scoped>
@import url(./container.css);
</style>