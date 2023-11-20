<template>
    <m-form ref="form" :data="masterData" @closeForm="closeForm"  @submitForm="handleEdit">
        <m-dialog :title="'Phiếu chi ' + masterData.PaymentNo" class="payment-form" 
            @onClose="beforeClose">
            <template #body>
                <div class="payment-content">
                    <div class="form-section">
                        <div class="payment-total">
                            <span class="payment-total__title">Tổng tiền</span>
                            <span class="payment-total__value">{{ helper.formatCell(masterData.Total ?? 0, Number) }}</span>
                        </div>
                        <div class="layout">
                            <div class="row">
                                <div class="col col-6">
                                    <div class="row pd-6">
                                        <div class="col col-4">
                                            <m-combobox-table :disabled="mode === this.$enum.TableMode.VIEW"
                                                :callAtMount="!slug" @getData="getObject" :column="objectColumn"
                                                @inputChange="changeSupplier" idField="SupplierId" valueField="SupplierCode"
                                                :bindToAnotherField="['SupplierName', 'Address']"
                                                :tableType="this.$enum.TableType.FLAT" label="Mã đối tượng" :items="objects"
                                                v-model="masterData.SupplierId"></m-combobox-table>
                                            <m-input :disabled="mode === this.$enum.TableMode.VIEW" label="Người nhận"
                                                v-model="masterData.ReceiveName"></m-input>
                                        </div>
                                        <div class="col col-6" @click="console.log(this.masterData)">
                                            <m-input :disabled="mode === this.$enum.TableMode.VIEW" label="Tên đối tượng"
                                                v-model="masterData.SupplierContactName"></m-input>
                                            <m-input :disabled="mode === this.$enum.TableMode.VIEW" label="Địa chỉ"
                                                v-model="masterData.Address"></m-input>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col col-10">
                                            <m-input :disabled="mode === this.$enum.TableMode.VIEW" label="Lý do chi"
                                                v-model="explain"></m-input>
                                        </div>
                                    </div>
                                </div>
                                <div class="col col-4 divide">
                                    <div class="row">
                                        <div class="col col-4">
                                            <m-input :limitDate="masterData.RecordDate" limitField="Ngày chứng từ"
                                                :disabled="mode === this.$enum.TableMode.VIEW" label="Ngày hạch toán"
                                                inputType="date" v-model="masterData.PaymentDate"></m-input>
                                            <m-input :disabled="mode === this.$enum.TableMode.VIEW" label="Ngày phiếu chi"
                                                inputType="date" v-model="masterData.RecordDate"></m-input>
                                            <m-input ref="PaymentNo" :isRequired="true" :showRequired="false"
                                                :disabled="mode === this.$enum.TableMode.VIEW" label="Số phiếu chi"
                                                v-model="masterData.PaymentNo"></m-input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col col-4">
                                    <div class="row pd-6">
                                        <div class="col col-6">
                                            <m-combobox-table :disabled="mode === this.$enum.TableMode.VIEW"
                                                label="Nhân viên" idField="EmployeeId" valueField="EmployeeCode"
                                                :items="emplooyee" :column="employeeColumn"
                                                :tableType="this.$enum.TableType.FLAT" v-model="masterData.EmployeeId"
                                                :callAtMount="!slug" @getData="getEmployee">

                                            </m-combobox-table>
                                        </div>
                                        <div class="col col-4 invoice-wrapper">
                                            <m-input formatType="number" :disabled="mode === this.$enum.TableMode.VIEW"
                                                label="Kèm theo" v-model="masterData.DocumentInclude"></m-input>
                                            <div class="invoice">chứng từ gốc</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-section">
                        <div class="table-section-wrapper" @click="console.log(detailData)">
                            <m-table-tree :overflow="true" :headers="headersDetail" :data="detailData" :mode="mode"
                                :showHeader="false" :showFooter="false">
                                <template #extraRow>
                                    <tr class="extra-row">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="align-right">{{ helper.formatCell(masterData.Total ?? 0, Number) }}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </template>
                            </m-table-tree>
                            <div class="action-wrapper">
                                <m-button @click="addRow" variant="outline">Thêm dòng</m-button>
                                <m-button @click="removeAllRow" variant="outline">Xóa hết dòng</m-button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button variant="outline" @click="handleEdit">
                    {{ mode === this.$enum.TableMode.VIEW ? "Sửa" : "Cất" }}
                </m-button>
                <m-button>Cất và in</m-button>
                <m-button variant="outline" class="left">Hủy</m-button>
            </template>
        </m-dialog>
    </m-form>
    <div class="error-dialog-container" v-if="dialog.show">
            <m-modal>
                <m-dialog @onClose="closeDialog" :width="'424px'" :class="'no-footer-border'">
                    <template #body>
                        <div class="noti-content">
                            <span v-if="dialog.type===this.$enum.ToastType.WARNING" class="icon warning-icon"></span>
                            <span v-if="dialog.type===this.$enum.ToastType.ERROR" class="icon error-icon"></span>
                            <div class="error-messages-container">
                                <p v-for="msg in dialog.msg" :key="msg">
                                    {{ dialog.msg.length > 1 ? "- " + msg : msg }}
                                </p>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        <m-button :autofocus="true" class="left" variant="outline" @click="closeDialog">{{
                            this.$message.form.buttons.CLOSE
                        }}</m-button>
                        <m-button :autofocus="true" :class="'left-align'" @click="submitDialog">Có</m-button>
                    </template>
                </m-dialog>
            </m-modal>
        </div>
</template>

<script>
import { paymentDetailColumn, objectColumn, employeeColumn } from '@/js/MISAEntity'
import { config } from '@/main'
import helper from '@/js/MISAHelper'
import * as paymentServices from '@/services/payment-services'
import * as objectServices from '@/services/object-services'
import * as employeeServices from '@/services/employee-services'

export default {
    props: ['slug', 'row'],
    data() {
        return {
            dialog: {},
            helper,
            objectColumn,
            employeeColumn,
            headersDetail: paymentDetailColumn,
            initEmployeeId: null,
            initSupplierId: null,
            masterData: {
                PaymentNo: null,
                PaymentDate: null,
                RecordDate: null,
                Total: null,
                SupplierId: null,
                SupplierContactName: null,
                Address: null,
                ReceiveName: null,
                Explain: "Chi tiền cho ",
                DocumentInclude: null,
                EmployeeId: null,
            },
            detailDataInit: [
                {
                    Amount: 0,
                    CreditAccountId: null,
                    DebitAccountId: null,
                    Explain: "Chi tiền cho ",
                    PaymentDetailId: null,
                    PaymentId: null,
                    SupplierId: null,
                }
            ],
            detailData: [],
            mode: this.$enum.TableMode.VIEW,
            config,
            objects: [],
            emplooyee: [],
            objectName: null,
            explain: "Chi tiền cho ",
            oldDetailData: [],
            isChangeBindFields: false,
        }
    },
    methods: {
        beforeClose() {
            console.log(this.$refs.form.checkChange())
            if(this.$refs.form.checkChange()) 
                this.$refs.form.showDialog = true;
            else this.closeForm();
        },
        closeForm() {
            this.$router.back()
        },
        closeDialog() {
            this.dialog= {}
        },
        async getMaster() {
            let res = await paymentServices.getPaymentById(this.slug || this.$route.query.id)
            res = { ...res, PaymentDate: res.PaymentDate.substring(0, 10), RecordDate: res.RecordDate.substring(0, 10) }
            this.masterData = res
            console.log(this.masterData.SupplierId)
        },
        async getDetails() {
            const res = await paymentServices.getDetails(this.slug || this.$route.query.id)
            this.detailData = res.Data
        },
        async getObject(filter, pageSize, pageNum) {
            const res = await objectServices.getObjects(filter, pageSize, pageNum, this.initSupplierId)
            this.objects = res.Data
        },
        async getEmployee(filter, pageSize, pageNum) {
            const res = await employeeServices.getEmployees(pageSize, pageNum, filter, this.initEmployeeId)
            this.emplooyee = res.Data
        },
        async handleEdit() {
            if (this.mode == this.$enum.TableMode.VIEW)
                this.mode = this.$enum.TableMode.EDIT
            else if (this.slug) {
                let payload = {
                    Payment: null,
                    DetailsCreate: [],
                    DetailsUpdate: [],
                    DetailDeleteIds: [],
                }
                payload.Payment = this.masterData
                for (const e of this.detailData) {
                    if (e.PaymentDetailId) {
                        payload.DetailsUpdate = [...payload.DetailsUpdate, e]
                    } else {
                        payload.DetailsCreate = [...payload.DetailsCreate, e]
                    }
                }
                let deleteObjects = this.oldDetailData.filter(e => !this.detailData.includes(e))
                payload.DetailDeleteIds = deleteObjects.map(e => e.PaymentDetailId)
                const res = await paymentServices.updatePayment(payload)
                
                console.log(res)
                // this.$router.push('/cash/payment')
            }
            if (!this.slug) {
                let total = 0
                this.detailData.forEach(e => {
                    total += e.Amount
                })
                this.masterData.Total = total
                const isValid = this.$refs.form.validate()
                if (!isValid) return
                const res = await paymentServices.createPayment(this.masterData, this.detailData)
                if (res.error) {
                    let dialog = {
                        type: this.$enum.ToastType.ERROR,
                        show: true,
                        msg: [],
                        code: res.errorCode,
                        otherData: res.otherData
                    }
                    if(res.errorCode == this.$enum.ErrorCode.CONFLICT_CODE) {
                        dialog.msg = [`Số chứng từ <${this.masterData.PaymentNo}> đã tồn tại. Bạn có muốn chương trình tự động tăng số chứng từ không?`]
                        this.$refs.PaymentNo.customValidate(res.title)
                    }
                    this.dialog = dialog
                    console.log(res)
                } else {
                    this.$router.push('/cash/payment')
                }
            }
        },
        addRow() {
            if (this.mode === this.$enum.TableMode.EDIT) {
                let recentData = this.detailData[this.detailData.length - 1]
                let newRow = JSON.parse(JSON.stringify(recentData));
                console.log(recentData)
                this.detailData = [...this.detailData, newRow]
                this.changeTotal()
            }
        },
        removeAllRow() {
            if (this.mode === this.$enum.TableMode.EDIT) {
                // this.detailData = []
                // setTimeout(() => {
                //     let emptyArr = [this.detailDataInit]
                //     this.detailData = [...emptyArr]
                // }, 50)
                this.detailData = []
                setTimeout(() => {
                    this.detailData = [...this.detailDataInit]
                    this.detailData[0].Explain = this.masterData.Explain
                    this.detailData[0].SupplierId = this.masterData.SupplierId
                }, 50)

                this.masterData.Total = 0
            }
        },
        getCurrentDate() {
            const currentDate = new Date();

            // Lấy thông tin về năm, tháng và ngày
            const year = currentDate.getFullYear();

            // Tháng trong JavaScript được đếm từ 0, vì vậy cần cộng thêm 1
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

            const day = currentDate.getDate().toString().padStart(2, '0');

            // Tạo chuỗi ngày mới
            const formattedDate = `${year}-${month}-${day}`;

            return formattedDate;
        },
        handleRemoveRow(row) {
            let index = this.detailData.indexOf(row)
            if (index > -1) this.detailData.splice(index, 1);
            this.detailData = [...this.detailData]
            console.log(this.detailData)
            // for (const iterator of this.detailData) {
            //     console.log(iterator===row)
            // }
            this.changeTotal()
        },
        changeTotal() {
            let total = 0
            for (const e of this.detailData) {
                total += e.Amount
            }
            this.masterData.Total = total
        },
        changeSupplier(newId, newBindVal) {
            this.masterData.SupplierId = newId
            if (this.isChangeBindFields || this.mode == this.$enum.TableMode.EDIT) {
                for (const e of newBindVal) {
                    if (e.key == 'SupplierName') e.key = 'SupplierContactName'
                    this.masterData[e.key] = e.value
                }
            }
            this.isChangeBindFields = true

        },
        submitDialog() {
            if(this.dialog.code == this.$enum.ErrorCode.CONFLICT_CODE) {
                this.masterData.PaymentNo = this.dialog.otherData
                this.dialog = {}
                this.handleEdit()
            }
        }
    },
    async created() {
        if (this.slug) {
            await this.getMaster()
            await this.getDetails()
            this.oldDetailData = [...this.detailData]
            this.initEmployeeId = this.masterData.EmployeeId
            this.initSupplierId = this.masterData.SupplierId
            this.getEmployee(null, 7, 1)
            this.getObject(null, 7, 1)
        } else if (!this.$route.query.id) {
            this.mode = this.$enum.TableMode.EDIT
            this.masterData.PaymentNo = await paymentServices.getNewCode()
            this.detailData = JSON.parse(JSON.stringify(this.detailDataInit));
            this.masterData.PaymentDate = this.getCurrentDate()
            this.masterData.RecordDate = "" + this.masterData.PaymentDate
        } else {
            this.mode = this.$enum.TableMode.EDIT
            let newCode = await paymentServices.getNewCode()
            await this.getMaster()
            await this.getDetails()
            this.initEmployeeId = this.masterData.EmployeeId
            this.initSupplierId = this.masterData.SupplierId
            this.masterData.PaymentNo = newCode
            this.masterData.PaymentId = undefined
            for (const e of this.detailData) {
                e.PaymentDetailId = undefined
            }
            this.getEmployee(null, 7, 1)
            this.getObject(null, 7, 1)
        }
    },
    mounted() {
        this.$emitter.on('changeTotal', this.changeTotal)
        this.$emitter.on('removeRow', this.handleRemoveRow)
    },
    unmounted() {
        this.$emitter.off('changeTotal', this.changeTotal)
        this.$emitter.off('removeRow', this.handleRemoveRow)
    },
    watch: {
        masterData(newVal) {
            if (newVal.Explain && this.explain == null) {
                this.explain = newVal.Explain
            }
        },
        'masterData.SupplierId': function (newVal, oldVal) {
            for (const e of this.detailData) {
                console.log(e.SupplierId, oldVal, newVal)
                if (e.SupplierId == oldVal) {
                    e.SupplierId = newVal
                }
            }
            if(newVal == null) this.$emitter.emit('resetSelected')
        },
        'masterData.SupplierContactName': function (newVal, oldVal) {
            if (!oldVal || "Chi tiền cho " + oldVal === this.explain ) {
                if(newVal != null) {
                    this.explain = "Chi tiền cho " + newVal
                } else this.explain = "Chi tiền cho "
            }
        },
        'masterData.PaymentDate': function (newVal, oldVal) {
            if (oldVal == this.masterData.RecordDate) {
                this.masterData.RecordDate = newVal
            }
        },
        'masterData.RecordDate': function (newVal, oldVal) {
            console.log(newVal, oldVal)
        },
        'masterData.Explain': function (newVal, oldVal) {
            for (const e of this.detailData) {
                if (e.Explain == oldVal) {
                    e.Explain = newVal
                }
            }
        },
        explain(newVal) {
            this.masterData.Explain = newVal
        }
    },
}
</script>

<style>
@import url(./payment-detail.css);
</style>