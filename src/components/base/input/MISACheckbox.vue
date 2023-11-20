<template>
    <div class="checkbox-container">
        <input ref="input" type="checkbox" name="" @input="handleValueChange" class="custom-checkbox" :id="checkboxId">
        <label class="checkbox" :for="checkboxId">
            <span class="tick"></span>
        </label>
        <label for="checkbox" class="checkbox-label">{{ label }}</label>
    </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid'
export default {
    props: {
        label: String,
        modelValue: null,
    },
    methods: {
        /**
         * Xử lý UI check/uncheck
         * @param {Event} e 
         * Created by: dktuan (24/10/2023)
         */
        handleValueChange(e) {
            this.$emit('update:modelValue', e.target.checked)
        }
    },
    computed: {
        checkboxId() {
            return uuidv4()
        }
    },
    mounted() {
        if(this.modelValue) {
            this.$refs.input.checked=true
        }
    },
}
</script>

<style>
@import url(./input.css);
</style>