<template>
    <div>
        <slot></slot>
    </div>
    <div class="error-dialog-container" v-if="showDialog">
        <m-modal>
            <m-dialog :width="'444px'" :class="'no-footer-border'" @onClose="rejectClose">
                <template #body>
                    <div class="noti-content">
                        <span class="icon question-icon"></span>
                        <div class="error-messages-container">
                            <p>Dữ liệu đã bị thay đổi. Bạn có muốn cất không?</p>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <m-button @click="rejectClose" :class="'left'" variant="outline">{{
                        this.$message.form.buttons.CANCEL }}</m-button>
                    <m-button @click="acceptClose" :class="'left-align'" variant="outline">Không</m-button>
                    <m-button :autofocus="true" @click="acceptSubmit">Có</m-button>
                </template>
            </m-dialog>
        </m-modal>
    </div>
    <div class="error-dialog-container" v-if="errorDialog.show">
        <m-modal>
            <m-dialog @onClose="closeDialog" :width="'424px'" :class="'no-footer-border'">
                <template #body>
                    <div class="noti-content">
                        <span v-if="errorDialog.type === this.$enum.ToastType.WARNING" class="icon warning-icon"></span>
                        <span v-if="errorDialog.type === this.$enum.ToastType.ERROR" class="icon error-icon"></span>
                        <div class="error-messages-container">
                            <p v-for="msg in errorDialog.msg" :key="msg">
                                {{ errorDialog.msg.length > 1 ? "- " + msg : msg }}
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
</template>

<script>
export default {
    emits: ["closeForm"],
    props: ["data", "ignoreField"],
    data() {
        return {
            formFields: [],
            oldData: {},
            showDialog: false,
            errorDialog: {},
            firstErrorInput: null,
        }
    },
    methods: {
        closeDialog() {
            this.errorDialog.show = false
            if (this.firstErrorInput) this.firstErrorInput.focus()
        },
        /**
         * Thêm các component input vào mảng để validate khi submit
         * @param {Object} field 
         * Created by: dktuan (06/09/2023)
         */
        registerField(field) {
            this.formFields.push(field);
        },
        /**
         * Validate các input trong form
         * Created by: dktuan (06/09/2023)
         */
        validate() {
            // Kiểm tra xem tất cả các input đã được validate chưa
            let isValid = true;
            let dialog = {
                type: this.$enum.ToastType.ERROR,
                show: true,
                msg: [],
            }
            for (let i = this.formFields.length - 1; i >= 0; i--) {
                this.formFields[i].validate();
                if (this.formFields[i].error) {
                    this.firstErrorInput = this.formFields[i]
                    isValid = false
                    dialog.msg = [this.formFields[i].errorMessage]
                }
            }
            if (!isValid) this.errorDialog = dialog
            return isValid;
        },
        /**
         * Kiểm tra thay đổi của form
         * Created by: dktuan (09/10/2023)
         */
        checkChange() {
            for (let key in this.data) {
                if (key == this.ignoreField) continue
                if (this.data[key] != this.oldData[key]) {
                    console.log(this.data[key], this.oldData[key])
                    return true
                }
            }
            return false;
        },
        acceptSubmit() {
            this.showDialog=false
            this.$emit('submitForm')
        },
        /**
         * Đóng form
         * Created by: dktuan (09/10/2023)
         */
        acceptClose() {
            this.$emit('closeForm')
            console.log('===')
            this.showDialog = false;
        },
        /**
         * giữ lại form
         * Created by: dktuan (09/10/2023)
         */
        rejectClose() {
            this.showDialog = false;
        }
    },
    created() {
        this.$emitter.on('registerField', this.registerField)
    },
    mounted() {
        this.oldData = { ...this.data };
    },
}
</script>

<style scoped></style>