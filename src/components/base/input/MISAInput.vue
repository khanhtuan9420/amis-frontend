<template>
    <div class="label">
        <label v-if="label" :title="labelTitle" class="label-name" for="">{{ label }}</label>
        <div v-if="isRequired && showRequired" class="required">*</div>
    </div>
    <tippy v-tippy="{ placement: 'bottom' }">
        <input @keypress="validateInput" ref="input" :disabled="disabled"
            :value="formatType === 'number' ? helper.formatCell(modelValue, Number) : modelValue" @input="updateModelValue"
            required=isRequired class="text-input" :class="{
                'invalid': error,
                'mb-0': error,
                'align-right': formatType === 'number'
            }" :type="inputType" :name="name">
        <template #content>
            <div v-if="error" :title="errorMessage" class="error-message">{{ errorMessage }}</div>
        </template>
    </tippy>
</template>

<script>
import { config } from '@/main';
import helper from '@/js/MISAHelper';
export default {
    emits: ['update:modelValue', 'inputChange'],
    props: {
        showRequired: {
            type: Boolean,
            default: true
        },
        label: String,
        labelTitle: String,
        isRequired: Boolean,
        regex: RegExp,
        maxLength: null,
        minLength: null,
        limitDate: String,
        limitField: String,
        inputType: {
            type: String,
            default: 'text',
        },
        placeHolder: String,
        name: String,
        data: null,
        modelValue: null,
        autofocus: Boolean,
        disabled: Boolean,
        bindRef: Boolean,
        formatType: null,
    },
    data() {
        return {
            numberVal: null,
            helper: helper,
            error: false,
            errorMessage: ""
        }
    },
    methods: {
        validateInput(event) {
            if (this.formatType === 'number') {
                // Ngăn người dùng nhập chữ
                const charCode = event.charCode || event.keyCode;
                const char = String.fromCharCode(charCode);
                const isNumber = /\d/.test(char);

                if (!isNumber) {
                    event.preventDefault();
                }
            }
        },
        convertToNumber(data) {
            // Loại bỏ dấu chấm và các ký tự không phải số khác
            if (data == null || data.length == 0) return 0
            const numberString = data.replace(/[^\d]/g, '');

            // Chuyển đổi thành số nguyên
            const numberValue = parseInt(numberString, 10);

            return isNaN(numberValue) ? null : numberValue;
        },
        /**
         * Two ways binding input
         * Created by: dktuan (19/08/2023)
         */
        updateModelValue(event) {
            let value = event.target.value
            if (this.formatType === 'number') {
                value = this.convertToNumber(event.target.value)
                if (!value) value = 0
            }
            if (this.bindRef) {
                this.$emit('inputChange', value)
            } else {
                this.$emit('update:modelValue', value);
            }
            if(this.inputType != 'date' || (this.inputType=='date' && this.error)) {
                this.validate(event.target.value);
            }
        },
        /**
         * focus input
         * Created by: dktuan (06/09/2023)
         */
        focus() {
            this.$refs.input.focus();
        },
        customValidate(errorMessage) {
            this.error = true
            this.errorMessage = errorMessage
            this.focus()
        },
        /**
         * Validate input
         * @param {String} val 
         * Created by: dktuan (06/09/2023)
         */
        validate(val = this.modelValue) {
            if (this.isRequired && !val) {
                this.error = true;
                this.errorMessage = config.$message.form.input.required(this.label)
                return
            }
            if (this.regex) {
                if (!this.regex.test(val)) {
                    this.error = true;
                    this.errorMessage = config.$message.form.input.regex(this.label, this.regex)
                    return
                }
            }
            if (this.maxLength && val != null) {
                if (val.length > this.maxLength) {
                    this.error = true;
                    this.errorMessage = config.$message.form.input.maxLength(this.label, this.maxLength)
                    return
                }
            }
            if (this.minLength && val != null) {
                if (val.length < this.minLength) {
                    this.error = true;
                    this.errorMessage = config.$message.form.input.minLength(this.label, this.minLength)
                    return
                }
            }

            if (this.inputType == 'date' && this.limitDate) {
                if (val < this.limitDate) {
                    this.error = true;
                    this.errorMessage = config.$message.form.input.limitDate(this.label, this.limitField, 
                        helper.formatDate(this.limitDate))
                    return
                }
            }
            this.error = false
        },
        /**
         * Đăng ký với Form để chạy validate trước khi submit
         * Created by: dktuan (06/09/2023)
         */
        register() {
            this.$emitter.emit('registerField', this);
        },
    },

    mounted() {
        if (this.autofocus) this.focus();
        this.register();
    },
    // watch: {
    //     modelValue(newVal) {
    //         console.log(newVal)
    //     }
    // },
}
</script>

<style scoped>
@import url(./input.css);

input {
    font-family: NotoRegular, sans-serif;
}
</style>