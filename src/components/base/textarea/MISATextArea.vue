<template>
    <div class="label">
        <label v-if="label" :title="labelTitle" class="label-name" for="">{{ label }}</label>
        <div v-if="isRequired" class="required">*</div>
    </div>
    <textarea @input="updateModelValue" class="m-textarea" maxLength="300"></textarea>
    <div v-if="error" :title="label+' '+errorMessage" class="error-message text-truncate">{{errorMessage}}</div>
</template>

<script>
import { config } from '@/main';
export default {
    emits: ['update:modelValue'],
    props: {
        label: String,
        labelTitle: String,
        isRequired: Boolean,
        regex: RegExp,
        maxLength: null,
        inputType: {
            type: String,
            default: 'text',
        },
        placeHolder: String,
        name: String,
        data: null,
        modelValue: null,
        autofocus: Boolean,
    },
    data() {
        return {
            error: false,
            errorMessage: ""
        }
    },
    methods: {
        /**
         * Two ways binding input
         * Created by: dktuan (19/08/2023)
         */
        updateModelValue(event) {
            this.$emit('update:modelValue', event.target.value);
            this.validate(event.target.value);
        },
        /**
         * focus input
         * Created by: dktuan (06/09/2023)
         */
        focus() {
            this.$refs.input.focus();
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
            if(this.regex) {
                if(!this.regex.test(val)) {
                    this.error = true;
                    this.errorMessage = config.$message.form.input.regex(this.label, this.regex)
                    return
                }
            }
            if(this.maxLength && val != null) {
                if(val.length > this.maxLength) {
                    this.error=true;
                    this.errorMessage = config.$message.form.input.maxLength(this.label, this.maxLength)
                    return
                }
            }
           this.error=false
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
        if(this.autofocus) this.focus();
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
@import url(./textarea.css);

input {
    font-family: NotoRegular, sans-serif;
}
</style>