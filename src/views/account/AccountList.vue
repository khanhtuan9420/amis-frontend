<template>
    <section class="header-section">
        <h3>Hệ thống tài khoản</h3>
        <m-button @click="addAccount">Thêm</m-button>
    </section>
    <!-- <m-table type="tree" searchPlaceHolder="Tìm kiếm theo tên, số tài khoản" :headers="tableHeader"
        :data="fakeData"></m-table> -->
    <div class="content-section">
        <m-table-tree :totalRecords="totalRecord" :showFooter="false" class="full-screen" type="tree" tableName="Tài khoản"
            @deleteRecordByRow = "deleteAccount" @toggleActive = "toggleActive" parentIdField="GeneralAccountId"
            searchPlaceHolder="Tìm kiếm theo tên, số tài khoản" :headers="accountColumn" :IdField="'AccountId'"
            :valueField="'AccountNumber'" :tableType="config.$enum.TableType.TREE" :data="tableData"
            :mode="config.$enum.TableMode.VIEW" size="full" @loadNewPage="getAccounts"
            :showLoading="showLoading"></m-table-tree>
    </div>
    <AccountForm @updateData="updateData" :data="tableData" :parentRow="parentRow" :formMode="formMode" v-model="formData"
        @closeForm="showForm = false" v-if="showForm"></AccountForm>
</template>

<script>
import AccountForm from './AccountForm.vue';
import { accountColumn } from '@/js/MISAEntity';
import enums from '@/js/MISAEnum';
// import helper from '@/js/MISAHelper';
import { config } from '@/main';
import * as accountHelper from './account-helper'
import * as accountService from '@/services/account-services'
export default {
    components: { AccountForm },
    data() {
        return {
            tableData: [],
            showForm: false,
            accountColumn: accountColumn,
            config: config,
            showLoading: false,
            formMode: null,
            formData: null,
            parentRow: null,
            totalRecord: null,
        };
    },
    methods: {
        /**
         * Mở form
         * Created by: dktuan (24/10/2023)
         */
        addAccount() {
            this.formMode = enums.FormType.ADD
            this.showForm = true
            this.formData = null
        },
        /**
         * Lấy các bản ghi mới
         * @param {*} searchString 
         * @param {*} pageSize 
         * @param {*} pageNum 
         * Created by: dktuan (01/11/2023)
         */
        async getAccounts(searchString, pageSize, pageNum) {
            this.showLoading = true
            console.log(pageNum, pageSize)
            const res = await accountService.getAccountFilter(true, searchString, null, null)

            const map = accountHelper.mapperMany(res.Data)
            this.totalRecord = res.TotalRecord
            this.tableData = map
            this.showLoading = false
        },
        /**
         * Lấy các bản ghi con của bản ghi cha
         * @param {*} row 
         * @param {*} searchString 
         * Created by: dktuan (01/11/2023)
         */
        async getChildren(row, searchString) {
            const res = await accountService.getChildren(searchString, row.AccountId)
            row.Children = accountHelper.mapperMany(res);
        },
        /**
         * Chuyển form sang chế độ sửa, tìm bản ghi cha, gán dữ liệu vào form
         * @param {*} data 
         * Created by: dktuan (05/11/2023)
         */
        editAccount(data) {
            this.formMode = enums.FormType.EDIT
            for (const row of this.tableData) {
                if (row.AccountId === data.GeneralAccountId) {
                    this.parentRow = row
                    break;
                }
                this.parentRow = null
            }
            this.formData = data
            this.showForm = true
        },
        /**
         * Thêm bản ghi mới và dựng lại cây
         * @param {*} data 
         * @param {*} index 
         * Created by: dktuan (05/11/2023)
         */
        updateData(data, index) {
            console.log(index)
            data = accountHelper.mapper(data)
            this.tableData.splice(index, 0, data)
            console.log(this.tableData)
            this.tableData = [...this.tableData]
        },
        replicateAccount(data) {
            this.formMode = enums.FormType.ADD
            for (const row of this.tableData) {
                if (row.AccountId === data.GeneralAccountId) {
                    this.parentRow = row
                    break;
                }
                this.parentRow = null
            }
            this.formData = data
            this.showForm = true
        },
        async deleteAccount(data) {
            if (data.Children.length > 0) {
                const dialogState = {
                    type: config.$enum.ToastType.ERROR,
                    error: true,
                    show: true,
                    msg: ["Xóa không thành công. Không thể xóa danh mục cha nếu chưa xóa danh mục con."],
                }
                this.$emitter.emit('openErrorDialog', dialogState)
                return
            }
            if (data.GeneralAccountId) {
                let num = 0;
                let prefix = null
                let r = null
                for (const row of this.tableData) {
                    if (row.AccountId === data.GeneralAccountId) {
                        prefix = row.AccountNumber
                        r = row
                        continue
                    }
                    if (prefix) {
                        if (row.AccountNumber.startsWith(prefix)) num = num + 1;
                        else {
                            console.log(num)
                            if (num < 2) r.IsParent = false
                            console.log(r)
                            break
                        }
                    }
                }
            }
            const res = await accountService.deleteAcount(data.AccountId);
            for (let index = 0; index < this.tableData.length; index++) {
                if (data.AccountId === this.tableData[index].AccountId) {
                    let cloneTableData = [...this.tableData]
                    cloneTableData.splice(index, 1);
                    this.tableData=[...cloneTableData]
                    break;
                }

            }
            if (!res.error) {
                const toast = {
                    type: this.$enum.ToastType.SUCCESS,
                    message: this.$message.toast.messages.DELETE_SUCCESS,
                }
                this.$emitter.emit('addToast', toast)
            } else {
                this.$emitter.emit('openErrorDialog', res)
            }
        },
        async toggleActive(row, forceChild) {
            const res = await accountService.updateActiveStatus(row.AccountId, !row.Active, forceChild)
            if(res.error) {
                this.$emitter.emit('openErrorDialog', res)
            } else {
                let cloneTableData = null
                this.tableData = this.tableData.map((e)=> {
                    if(res.includes(e.AccountId)) {
                        let newElement = {...e, Active: !row.Active}
                        return accountHelper.mapper(newElement)
                    }
                    else return e
                })
                console.log(cloneTableData)
            }
        }
    },
    mounted() {
        this.$emitter.on('editRecord', this.editAccount)
        this.$emitter.on('replicateRecord', this.replicateAccount)
    },
    unmounted() {
        this.$emitter.off('editRecord', this.editAccount)
        this.$emitter.off('replicateRecord', this.replicateAccount)
    },
    watch: {
        showForm(newVal) {
            if (!newVal && this.parentRow) this.parentRow = null
        }
    },
}
</script>

<style>
@import url(./accout.css);
</style>