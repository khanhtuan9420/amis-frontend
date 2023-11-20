<template>
    <button @blur="hideOutline" @click="showOutline" ref="button" class="btn" 
        :class="{
            'outline': variant === 'outline',
            'primary': variant === 'primary' && !icon,
            'whitebg': variant === 'whitebg',
            'icon-only': icon,
            'focus-visible': focusVisible
        }">
        <span :data="data" v-if="prependIcon && !icon" class="icon prepend-icon" :class="{[prependIcon]: prependIcon}"></span>
        <span v-if="!icon" class="content">
            <slot></slot>
        </span>
        <span :data="data" v-if="appendIcon && !icon" class="icon append-icon" :class="{[appendIcon]: appendIcon}"></span>
        <span :data="data" v-if="icon" class="icon" :class="{[icon]: icon}"></span>    
    </button>
</template>

<script>
export default {
    name: "m-button",
    props: {
        prependIcon: null,
        appendIcon: null,
        icon: null,
        variant: {
            type: String,
            default: "primary",
            validator: function (value) {
                // The value must match one of these strings
                return ['outline', 'primary', 'whitebg'].indexOf(value) !== -1
            }
        },
        outline: Boolean,
        autofocus: Boolean,
        data: String,
    },
    data() {
        return {
            focusVisible: false,
        }
    },
    methods: {
        /**
         * Focus vào button 
         * Created by: dktuan (22/09/2023)
         */
        focus() {
            if(!this.outline) {
                this.focusVisible=true
                this.$refs.button.focus();
            }
        },
        /**
         * Hiển thị outline của button
         * Created by: dktuan (22/09/2023)
         */
        showOutline() {
            this.focusVisible= this.outline || false;
        },
        /**
         * Ẩn outline
         * Created by: dktuan (22/09/2023)
         */
        hideOutline() {
            this.focusVisible=false;
        }
    },
    mounted() {
        // Focus sau khi mount
        if(this.autofocus) this.focus()
    },
}
</script>

<style scoped>
@import url(./button.css);
</style>