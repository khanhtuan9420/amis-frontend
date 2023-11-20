<template>
    <m-modal>
        <m-form ref="form" :data="formData" @closeForm="closeForm"  @submitForm="submit">
            <m-dialog type="fix" @onClose="beforeClose" title="Thêm tài khoản" :class="{ 'form-expand': isExpaned }">
                <template #body>
                    <m-button @click="expandForm" icon="expand-form-icon" class="expand-form-btn"></m-button>
                    <div class="layout">
                        <div class="row">
                            <div class="col col-25" @click="console.log(formData)">
                                <m-input ref="accountNumber" v-model="formData.AccountNumber" label="Số tài khoản"
                                    :minLenght="3" :isRequired="true"></m-input>
                            </div>
                        </div>
                        <div class="row pd-6">
                            <div class="col col-5">
                                <m-input v-model="formData.AccountName" label="Tên tài khoản" :isRequired="true"></m-input>
                            </div>
                            <div class="col col-5">
                                <m-input v-model="formData.AccountEnglishName" label="Tên tiếng Anh"></m-input>
                            </div>
                        </div>
                        <div class="row pd-6">
                            <div class="col col-25">
                                <m-combobox-table v-model="formData.GeneralAccountId" @getData="getGeneralAccount" :column="generalAccountColumn"
                                    :idField="'AccountId'" type="tree" :tableType="this.$enum.TableType.FLAT" :parentRow="parentRow" :valueField="'AccountNumber'"
                                    :items="generalAccount" label="Tài khoản tổng hợp"></m-combobox-table>
                            </div>
                            <div class="col col-25">
                                <m-combobox v-model="formData.Nature" label="Tính chất" :items="accountProperties"
                                    :isRequired="true"></m-combobox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-10">
                                <m-textarea v-model="formData.Explain" label="Diễn giải"></m-textarea>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-10">
                                <m-checkbox v-model="formData.ForeignCurrency" label="Có hạch toán ngoại tệ"></m-checkbox>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-10">
                                <m-accordion label="Theo dõi chi tiết theo">
                                    <template #content>
                                        <div class="row pd-24 input">
                                            <div class="col col-5">
                                                <m-combobox-checkbox :items="objectEntities" v-model="formData.FollowObject"
                                                    label="Đối tượng" :defaultIndex="1"></m-combobox-checkbox>
                                            </div>
                                            <div class="col col-5">
                                                <m-checkbox v-model="formData.FollowBankAccount"
                                                    label="Tài khoản ngân hàng"></m-checkbox>
                                            </div>
                                        </div>
                                        <div class="row pd-24 input">
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowCollectionCosts"
                                                    label="Đối tượng THCP"></m-combobox-checkbox>
                                            </div>
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowConstruction"
                                                    label="Công trình"></m-combobox-checkbox>
                                            </div>
                                        </div>
                                        <div class="row pd-24 input">
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions" v-model="formData.FollowOrder"
                                                    label="Đơn đặt hàng"></m-combobox-checkbox>
                                            </div>
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowContract"
                                                    label="Hợp đồng bán"></m-combobox-checkbox>
                                            </div>
                                        </div>
                                        <div class="row pd-24 input">
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowSellContract"
                                                    label="Hợp đồng mua"></m-combobox-checkbox>
                                            </div>
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowCostItem"
                                                    label="Khoản mục CP"></m-combobox-checkbox>
                                            </div>
                                        </div>
                                        <div class="row pd-24 input">
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions" v-model="formData.FollowOrder"
                                                    label="Đơn vị"></m-combobox-checkbox>
                                            </div>
                                            <div class="col col-5">
                                                <m-combobox-checkbox :defaultIndex="0" :items="followOptions"
                                                    v-model="formData.FollowStatisticalCode"
                                                    label="Mã thống kê"></m-combobox-checkbox>
                                            </div>
                                        </div>
                                    </template>
                                </m-accordion>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <m-button variant="outline" @click="store">Cất</m-button>
                    <m-button @click="storeAndAdd">Cất và thêm</m-button>
                    <m-button variant="outline" class="left">Hủy</m-button>
                </template>
            </m-dialog>
        </m-form>
    </m-modal>
    <m-dialog></m-dialog>
</template>

<script>
import * as accountServices from '@/services/account-services'
import helper from '@/js/MISAHelper'
import { accountProperties, objectEntities, followOptions } from '@/js/MISAEntity'
import { config } from '@/main'
import { generalAccountColumn, } from '@/js/MISAEntity';
export default {
    props: ["formMode", "modelValue", "parentRow", 'data'],
    data() {
        return {
            isExpaned: false,
            generalAccount: [],
            accountProperties,
            objectEntities,
            followOptions,
            generalAccountColumn,
            oldGeneralAccountId: this.modelValue?.GeneralAccountId,
            formData: {
                AccountNumber: null,
                AccountName: null,
                AccountEnglishName: null,
                GeneralAccountId: null,
                Nature: null,
                Explain: null,
                ForeignCurrency: null,
                FollowObject: null,
                FollowBankAccount: null,
                FollowCollectionCosts: null,
                FollowConstruction: null,
                FollowOrder: null,
                FollowContract: null,
                FollowSellContract: null,
                FollowCostItem: null,
                FollowUnit: null,
                FollowStatisticalCode: null,
                IsParent: null,
                Grade: null,
                Active: null,
            }
        }
    },
    methods: {
        beforeClose() {
            if(this.$refs.form.checkChange()) 
                this.$refs.form.showDialog = true;
            else this.closeForm();
        },
        /**
         * Mở rộng kích thước form
         * Created by: dktuan (24/10/2023)
         */
        expandForm() {
            this.isExpaned = !this.isExpaned
        },
        /**
         * Đóng form
         * Created by: dktuan (24/10/2023)
         */
        closeForm() {
            this.$emit('closeForm')
        },
        async getGeneralAccount(filter, pageSize, pageNum) {
            const res = await accountServices.getAccountFilter(true, filter, pageSize, pageNum, this.parentRow?.AccountId)
            this.generalAccount = res.Data
        },
        customValidate() {
            if (this.formData.GeneralAccountId) {
                let accountNumber = this.formData.AccountNumber
                let prefix = null
                for (let row of this.data) {
                    if (row.AccountId == this.formData.GeneralAccountId) {
                        prefix = row.AccountNumber.slice(0,-1)
                        console.log(this.formData.GeneralAccountId)
                        if (!accountNumber.startsWith(prefix)) {
                            const toast = {
                                type: this.$enum.ToastType.ERROR,
                                message: this.$message.toast.messages.ACCOUNT_NUMBER_NOT_MATCH_PREFIX,
                                action: this.$message.toast.actions.UNDO
                            }
                            this.$emitter.emit('addToast', toast)
                            return false
                        }
                    }
                }
            }
            return true
        },
        /**
         * validate, gửi form, hiện dialog (lỗi) hoặc toast (thành công)
         * Created by: dktuan (20/08/2023)
         */
        async submit() {
            // Kiểm tra xem tất cả các input đã được validate chưa
            let isValid = this.$refs.form.validate()
            if (!isValid) return
            isValid = this.customValidate()
            if(!isValid) return
            this.showLoading = true
            let res = null;
            let index = -1;
            let isChildren = false
            let prefix = null
            if (this.formMode == this.$enum.FormType.ADD) {
                if (this.formData.GeneralAccountId) {
                    for (const row of this.data) {
                        index++;
                        if (row.AccountId === this.formData.GeneralAccountId) {
                            this.formData = {
                                ...this.formData,
                                Grade: row.Grade + 1,
                                Active: true
                            }
                            row.IsParent = true
                            isChildren = true
                            prefix = row.AccountNumber
                            continue
                        }
                        if (isChildren) {
                            if (prefix != row.AccountNumber.slice(0, -1)) {
                                break
                            }
                        }
                    }
                }
                this.formData = {
                    ...this.formData,
                    "CreatedBy": "Khánh Tuân",
                }
                // res = await employeeServices.addEmployees(this.formData)
                res = await accountServices.createAccount(this.formData)
                this.formData.AccountId = res
                this.$emit('updateData', this.formData, index)
                console.log(this.formData)
            } else {
                this.formData = {
                    ...this.formData,
                    "ModifiedBy": "Khánh Tuân",
                }
                if(this.formData.GeneralAccountId != this.oldGeneralAccountId) {
                    let num = 0;
                    let prefix = null
                    let r = null
                    for(const row of this.data) {
                        if(row.AccountId === this.oldGeneralAccountId) {
                            prefix = row.AccountNumber
                            r = row
                            continue
                        }
                        if(prefix) {
                            if(row.AccountNumber.startsWith(prefix)) num=num+1;
                            else {
                                if(num<2) r.IsParent = false
                                break
                            }
                        }
                    }
                    for (const row of this.data) {
                        index++;
                        if (row.AccountId === this.formData.GeneralAccountId) {
                            this.formData = {
                                ...this.formData,
                                Grade: row.Grade + 1,
                                Active: row.Active
                            }
                            row.IsParent = true
                            isChildren = true
                            prefix = row.AccountNumber
                            continue
                        }
                        if (isChildren) {
                            if (prefix != row.AccountNumber.slice(0, -1)) {
                                break
                            }
                        }
                    }
                }
                this.$emit('updateData', this.formData, index)
                res = await accountServices.updateAccount(this.formData.AccountId, this.formData)
                // res = await employeeServices.updateEmployee(this.formData.EmployeeId, this.formData)
            }
            if (!res?.error) {
                const toast = {
                    title: this.$message.toast.titles.SUCCESS,
                    type: this.$enum.ToastType.SUCCESS,
                    message: this.$message.toast.messages.ADD_SUCCESS,
                    action: this.$message.toast.actions.UNDO
                }
                if (this.formMode == this.$enum.FormType.EDIT) {
                    toast.message = this.$message.toast.messages.EDIT_SUCCESS
                    helper.mapRowEdit(this.modelValue, this.formData)
                }
                this.$emitter.emit('addToast', toast)
                this.$emit('onSubmited')
                return true
            } else {
                switch (res.errorCode) {
                    case this.$enum.ErrorCode.CONFLICT_CODE:
                        res.msg=[config.$message.error[res.errorCode]("Số tài khoản", this.formData.AccountNumber)]
                        break;
                
                    default:
                        break;
                }
                this.$emitter.emit('openErrorDialog', res)
            }
        },
        /**
         * cất
         * Created by: dktuan (30/08/2023)
         */
        async store() {
            const isClose = await this.submit();
            if (isClose) this.closeForm();
        },
        /**
         * cất và thêm
         * Created by: dktuan (30/08/2023)
         */
        async storeAndAdd() {
            // const res = await this.submit();
            // const newCode = await employeeServices.getNewCode();
            // if (res) this.formData = { ...this.defaultFormData, EmployeeCode: newCode }
        }
    },
    created() {

    },
    mounted() {
        console.log(this.data)
        if (this.modelValue) {
            this.formData = { ...this.modelValue }
        }
        console.log(this.data)
    },
}
</script>

<style>@import url(./account-form.css);</style>