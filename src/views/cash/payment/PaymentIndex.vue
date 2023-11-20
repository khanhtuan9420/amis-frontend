<template>
    <div ref="container" @scroll="e => {
        this.$refs.container.scrollTop = 0
    }" class="payment-container">
        <div class="payment-master">
            <vue-resizable @resize:move="updateHeight" ref="resizeContainer" :active="['b']" :height="masterHeight"
                :maxHeight="615" :minHeight="2">
                <div ref="masterWrapper">
                    <m-table-tree :totalRecords="masterTotalRecords" ref="master" @deleteMany ="deleteMany" @deleteRecordByRow="deleteRecord" @exportToExcel="exportExcel"
                        @selectRow="handleSelectRow" :headers="headersMaster" IdField="PaymentId" :data="tableData"
                        @loadNewPage="getPayments" :showLoading="showLoading">
                        <template #postTableHeader>
                            <router-link to="/paymentDetail">
                                <m-button class="header-button">Chi tiền</m-button>
                            </router-link>
                        </template>
                        <template #extraRow>
                            <tr class="extra-row">
                                <td class="cell"></td>
                                <td class="cell align-center">Tổng</td>
                                <td class="cell"></td>
                                <td class="cell"></td>
                                <td class="cell"></td>
                                <td class="cell align-right">{{ helper.formatCell(total, Number) }}</td>
                                <td class="cell"></td>
                                <td class="cell"></td>
                                <td class="cell"></td>
                                <td class="cell edit-btn"></td>
                            </tr>
                        </template>
                    </m-table-tree>
                </div>
            </vue-resizable>
            <m-button @click="expandTable" icon="expand-form-icon" :class="{
                'expand-payment-table': true,
                'expand-payment-reverse': currentHeight >= fullScreenHeight
            }"></m-button>
        </div>
        <div class="payment-detail">
            <div class="payment-detail__tab">Chi tiết</div>
            <m-table-tree :totalRecords="detailTotalRecords" ref="tableDetail" :headers="headersDetail" :data="detailData" :showHeader="false"
                @loadNewPage="getPaymentDetails">
            </m-table-tree>
        </div>
    </div>
</template>

<script>
import { paymentColumn, paymentDetailColumnViewOnly } from '@/js/MISAEntity';
import * as paymentServices from '@/services/payment-services'
import helper from '@/js/MISAHelper';
import VueResizable from "vue-resizable";

export default {
    components: {
        VueResizable
    },
    computed: {
        fullScreenHeight() {
            return window.innerHeight - 56 - 32 - 16 - 32
        }
    },
    data() {
        return {
            showLoading: false,
            headersMaster: paymentColumn,
            headersDetail: paymentDetailColumnViewOnly,
            tableData: [],
            masterTotalRecords: null,
            detailTotalRecords: null,
            detailData: [],
            masterHeight: 400,
            collapseHeight: 0,
            currentHeight: 0,
            total: 0,
            helper,
            currentMaster: null,
        }
    },
    methods: {
        /**
         * Mở rộng hoặc thu gọn master
         * Created by: dktuan (01/11/2023)
         */
        expandTable() {
            if (this.masterHeight < this.fullScreenHeight) {
                this.collapseHeight = this.$refs.masterWrapper.clientHeight
                this.masterHeight = this.fullScreenHeight
            }
            else {
                this.masterHeight = this.collapseHeight
            }
            this.currentHeight = this.masterHeight
        },
        /**
         * cập nhật lại height khi resize
         * Created by: dktuan (01/11/2023)
         */
        updateHeight(data) {
            this.currentHeight = data.height
        },
        async getPayments(filter, pageSize, pageNum) {
            this.total = 0
            const res = await paymentServices.getPayments(filter, pageSize, pageNum)
            this.tableData = res.Data
            this.masterTotalRecords = res.TotalRecord
            this.total = res.Total
            this.currentMaster = res.Data[0]
        },
        async getPaymentDetails(filter, pageSize, pageNum) {
            if (!this.currentMaster) return
            const res = await paymentServices.getDetails(this.currentMaster.PaymentId, filter, pageSize, pageNum)
            this.detailData = res.Data
            this.detailTotalRecords = res.TotalRecord
        },
        async handleSelectRow(row) {
            this.currentMaster = row
            console.log(this.currentMaster)
        },
        viewRecord(row) {
            this.$router.push({
                name: 'PaymentDetailRouteId', params: {
                    slug: row.PaymentId,
                }
            })
        },
        async exportExcel(filter) {
            this.showLoading = true
            const res = await paymentServices.exportExcel(filter);
            this.showLoading = false
            return res;
        },
        async deleteRecord(row) {
            let list = []
            list.push(row.PaymentId);
            const res = await paymentServices.deleteRecords(list);
            return res;
        },
        async deleteMany(checkList=[]) {
            const res = await paymentServices.deleteRecords(checkList);
            await this.getPayments(this.$refs.master.searchString, this.$refs.master.recordPerPage, this.$refs.master.currentPage)
            return res;
        },
        replicateRecord(cloneVal, val) {
            this.$router.push({
                name: 'PaymentDetailRoute', query: {id: val.PaymentId}
            })
        }
    },
    mounted() {
        this.$emitter.on('replicateRecord', this.replicateRecord)
        this.$emitter.on('viewRecord', this.viewRecord)
    },
    unmounted() {
        this.$emitter.off('replicateRecord', this.replicateRecord)

        this.$emitter.on('viewRecord', this.viewRecord)
    },
    watch: {
        async currentMaster() {
            // await this.getPaymentDetails()
            const pageNum = this.$refs.tableDetail.currentPage;
            const pageSize = this.$refs.tableDetail.recordPerPage;
            await this.getPaymentDetails(null, pageSize, pageNum)
        }
    },
}
</script>

<style>@import url(./payment.css);</style>