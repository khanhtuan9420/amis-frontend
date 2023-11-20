<template>
    <div @click="console.log(modelValue)" class="combobox-with-checkbox">
        <m-checkbox ref="checkbox" v-model="check" :label="label"></m-checkbox>
        <m-combobox :defaultIndex="defaultIndex" v-model="value" :disabled="disabled" :items="items"></m-combobox>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
        items: Array,
        modelValue: null,
        defaultIndex: null,
    },
    data() {
        return {
            check: this.modelValue?true:false,
            disabled: true,
            value: this.modelValue,
        }
    },
    methods: {
    },
    mounted() {
        if(this.check) this.disabled=false
    },
    watch: {
        /**
         * Xử lý enable/disable combobox
         * @param {*} newVal 
         * Created by: dktuan (07/11/2023)
         */
        check(newVal) {
            console.log(newVal)
            if(newVal) this.disabled=false
            else this.disabled=true
        },
        /**
         * cập nhật check/uncheck của checkbox
         * @param {*} newVal 
         * Created by: dktuan (07/11/2023)
         */
        value(newVal) {
            this.$emit('update:modelValue', newVal)
        },
        /**
         * Gán dữ liệu ban đầu khi ở form sửa
         * @param {*} newVal 
         * Created by: dktuan (07/11/2023)
         */
        modelValue(newVal) {
            console.log(newVal)
            if(!this.value) {
                this.value = newVal
            }
        }
    },
}
</script>

<style>
@import url(./combobox.css);
</style>