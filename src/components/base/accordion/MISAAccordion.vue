<template>
    <div>
        <div class="accordion-header">
            <m-button id="accordion" variant="whitebg" :icon="collapsed?'close-accordion-icon':'open-accordion-icon'"
                @click="collapsed=!collapsed"></m-button>
            <label class="accordion-label" for="accordion">{{ label }}</label>
        </div>
        <div class="accordion-content" v-if="!collapsed">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: String,
    },
    data() {
        return {
            collapsed: true, 
        }
    },
}
</script>

<style>
@import url(./accordion.css);
</style>