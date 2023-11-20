<template>
    <div class="modal-content" :class="{'fix': type==='fix'}" :style="width !== 'unset' ? { width: width } : {}">
        <div class="modal-title-bar">
            <!-- <span @click="closeDialog" title="Đóng" class="close-btn"></span> -->
            <m-button ref="closeBtn" @click="closeDialog" title="Đóng" icon="close-icon" class="close-button"></m-button>
        </div>
        <div class="modal-header">
            <h3>{{ title }}</h3>
            <slot name="header-options"></slot>
        </div>
        <slot name="body"></slot>
        <div class="modal-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "m-dialog",
    emits: ['onClose', 'focusButton'],
    props: {
        title: String,
        width: {
            type: String,
            default: 'unset',
        },
        type: {
            type: String,
            default: "default",
            validator: function (value) {
                return ['default', 'fix'].indexOf(value) !== -1
            }
        }
    },
    methods: {
        /**
         * Đóng dialog
         * Author: dktuan (19/08/2023)
         */
        closeDialog() {
            this.$emit('onClose');
        },
        /**
         * Đóng dialog bởi phím ESC
         * @param {Event} e 
         * Created by: dktuan (19/08/2023)
         */
        closeByEsc(e) {
            if(e.keyCode === 27)
                this.closeDialog();
        },
        /**
         * focus vào button Đóng dialog
         */
        focusCloseButton() {
            console.log(this.$refs.closeBtn)
            this.$refs.closeBtn.focus();
        }
    },
    mounted() {
        window.addEventListener("keydown", this.closeByEsc)
    },
    unmounted() {
        window.removeEventListener("keydown", this.closeByEsc)
    },
}
</script>

<style scoped>
@import url(./modal.css);
</style>