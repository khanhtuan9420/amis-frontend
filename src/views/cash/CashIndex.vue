<template>
    <div class="cash-container">
        <div class="tab-bar">
            <router-link to="/cash/procedure">
                <span class="tab-bar__item">Quy trình</span>
            </router-link>
            <router-link to="/cash/payment">
                <span class="tab-bar__item">Thu tiền</span>
            </router-link>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
@import url(./cash.css);
</style>