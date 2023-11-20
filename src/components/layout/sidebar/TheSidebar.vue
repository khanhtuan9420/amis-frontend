<template>
    <div class="sidebar">    
            <div class="sidebar-content">
                <router-link to="/">
                    <m-button tabindex="-1" prependIcon="general-icon" class="sidebar-button">Tổng quan</m-button>
                </router-link>
                <router-link to="/cash">
                    <m-button tabindex="-1" prependIcon="cash-icon" class="sidebar-button">Tiền mặt</m-button>
                </router-link>
                <router-link to="/config">
                    <m-button tabindex="-1" prependIcon="deposit-icon" class="sidebar-button">Tiền gửi</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="purchase-icon" class="sidebar-button">Mua hàng</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="sell-icon" class="sidebar-button">Bán hàng</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="bill-icon" class="sidebar-button">Quản lý hóa đơn</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="warehouse-icon" class="sidebar-button">Kho</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="tool-icon" class="sidebar-button">Công cụ dụng cụ</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="real-estate-icon" class="sidebar-button">Tài sản cố định</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="tax-icon" class="sidebar-button">Thuế</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="price-icon" class="sidebar-button">Giá thành</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="synthetic-icon" class="sidebar-button">Tổng hợp</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="budget-icon" class="sidebar-button">Ngân sách</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="report-icon" class="sidebar-button">Báo cáo</m-button>
                </router-link>
                <router-link to="/q">
                    <m-button tabindex="-1" prependIcon="analysis-icon" class="sidebar-button">Phân tích tài chính</m-button>
                </router-link>
            </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>

<style scoped>
@import url(./sidebar.css);
</style>