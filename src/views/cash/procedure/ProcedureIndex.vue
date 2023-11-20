<template>
    <div class="procedure-container">
        <div class="procedure-content">
            <div>
                <h3 class="procedure-content__header">
                    Nghiệp vụ tiền mặt
                </h3>
                <div class="procedure-content__body">
                    <div class="procedure-item receive">
                        Thu tiền
                    </div>
                    <router-link to="/paymentDetail">
                        <div class="procedure-item payment">
                            Chi tiền
                        </div>
                    </router-link>
                    <div class="procedure-item audit">
                        Kiểm kê quỹ
                    </div>
                </div>
            </div>
            <div class="procedure-content__footer">
                <router-link to="/account">
                    <div class="procedure-content__footer__item">
                        <span class="icon account-system-icon"></span>
                        <p>
                            Hệ thống tài khoản
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style>
@import url(./procedure.css);
</style>