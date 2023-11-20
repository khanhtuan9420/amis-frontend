<template>
    <m-modal>
        <m-loading v-if="showLoading"></m-loading>
        <m-form ignoreField="EmployeeCode" :data="formData" ref="form" @closeForm="closeForm">
            <m-dialog ref="dialog" @onClose="beforeClose" :title="'Thông tin nhân viên'">
                <template #body>
                    <div class="layout">
                        <div class="row">
                            <div class="col col-5">
                                <div class="row pd-6">
                                    <div class="col col-4 ">
                                        <m-input :autofocus="true" v-model="formData.EmployeeCode" :label="'Mã'"
                                            :isRequired="true" :maxLength="10" :regex="/^NV-\d+$/" :name="'employeeCode'"></m-input>
                                    </div>
                                    <div class="col col-6 pd-6">
                                        <m-input :maxLength="30" v-model="formData.FullName" :label="'Tên'" :isRequired="true"
                                            :name="'fullName'"></m-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col col-10" @click="() => console.log(formData.DepartmentId)">
                                        <m-combobox :label="'Đơn vị'" :isRequired="true" :items="items"
                                            v-model="formData.DepartmentId"></m-combobox>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col col-10">
                                        <m-input :maxLength="30" v-model="formData.PositionName" :label="'Chức danh'"
                                            :name="'title'"></m-input>
                                    </div>
                                </div>
                            </div>
                            <div class="col col-5">
                                <div class="row pd-6">
                                    <div class="col col-4" @click="console.log(formData.DateOfBirth)">
                                        <!-- <m-input v-model="formData.DateOfBirth" :label="'Ngày sinh'"
                                            :inputType="'date'"></m-input> -->
                                        <m-date-input v-model="formData.DateOfBirth"
                                            label="Ngày sinh"></m-date-input>
                                    </div>
                                    <div class="col col-6">
                                        <div class="label">
                                            <label class="label-name" for="">Giới tính</label>
                                        </div>
                                        <div class="input-wrapper">
                                            <input v-model="formData.Gender" type="radio" class="radio-input" :value="0"
                                                name="gender" id="">
                                            <label class="label-name">Nam</label>
                                            <input v-model="formData.Gender" type="radio" class="radio-input" :value="1"
                                                name="gender" id="">
                                            <label class="label-name">Nữ</label>
                                            <input v-model="formData.Gender" type="radio" class="radio-input" :value="2"
                                                name="gender" id="">
                                            <label class="label-name">Khác</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="row pd-6">
                                    <div class="col col-6">
                                        <m-input :maxLength="30" v-model="formData.IdentityNumber" :label="'Số CMND'"
                                            :labelTitle="'Số Chứng minh nhân dân'" :name="'cmnd'"></m-input>
                                    </div>
                                    <div class="col col-4">
                                        <!-- <m-input v-model="formData.IdentityDate" :label="'Ngày cấp'" :inputType="'date'"
                                            :name="'releaseDate'"></m-input> -->
                                        <m-date-input v-model="formData.IdentityDate"
                                            label="Ngày cấp"></m-date-input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col col-10">
                                        <m-input :maxLength="100" v-model="formData.IdentityPlace" :label="'Nơi cấp'"
                                            :name="'releasePlace'"></m-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col col-10">
                                <div class="row pd-6">
                                    <div class="col col-10">
                                        <m-input :maxLength="100"  v-model="formData.Address" :label="'Địa chỉ'" :name="'address'"></m-input>
                                    </div>
                                    <div class="col col-25">
                                        <m-input :maxLength="50"  v-model="formData.PhoneNumber" :label="'ĐT di động'" :name="'mobilePhone'"
                                            :labelTitle="'Điện thoại di động'"></m-input>
                                    </div>
                                    <div class="col col-25">
                                        <m-input :maxLength="20"  v-model="formData.LandLineNumber" :label="'ĐT cố định'"
                                            :name="'landlinePhone'" :labelTitle="'Điện thoại cố định'"></m-input>
                                    </div>
                                    <div class="col col-25">
                                        <m-input :maxLength="50" v-model="formData.Email" :label="'Email'" :name="'email'"></m-input>
                                    </div>
                                </div>
                                <div class="row pd-6">
                                    <div class="col col-25">
                                        <m-input :maxLength="20"  v-model="formData.BankAccount" :label="'Tài khoản ngân hàng'"
                                            :name="'BankAccount'"></m-input>
                                    </div>
                                    <div class="col col-25">
                                        <m-input :maxLength="20"  v-model="formData.BankName" :label="'Tên ngân hàng'"
                                            :name="'BankName'"></m-input>
                                    </div>
                                    <div class="col col-25">
                                        <m-input :maxLength="50" v-model="formData.BankBranch" :label="'Chi nhánh'"
                                            :name="'BankBranch'"></m-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <m-button variant="outline" @click="store">Cất</m-button>
                    <m-button @click="storeAndAdd">Cất và Thêm</m-button>
                    <m-button @keydown.tab="tabToCloseBtn" @click="beforeClose" variant="outline" class="left">Hủy</m-button>
                </template>
            </m-dialog>
        </m-form>
    </m-modal>
</template>

<script>
import * as employeeServices from '@/services/employee-services'
import * as departmentServices from '@/services/department-services'
export default {
    emits: ['closeForm','onSubmited'],
    props: ['formMode', 'data'],
    methods: {
        /**
         * lấy danh sách đơn vị
         * Created by: dktuan (20/08/2023)
         */
        async getDepartments() {
            const res = await departmentServices.getDepartments();
            return res;
        },
        /**
         * validate, gửi form, hiện dialog (lỗi) hoặc toast (thành công)
         * Created by: dktuan (20/08/2023)
         */
        async submit() {
            // Kiểm tra xem tất cả các input đã được validate chưa
            const isValid = this.$refs.form.validate()
            if (!isValid) return
            this.showLoading = true
            let res = null;
            if (this.formMode == this.$enum.FormType.ADD) {
                this.formData = {
                    ...this.formData,
                    "CreatedBy": "Khánh Tuân",
                }
                res = await employeeServices.addEmployees(this.formData)
            } else {
                this.formData = {
                    ...this.formData,
                    "ModifiedBy": "Khánh Tuân",
                }
                res = await employeeServices.updateEmployee(this.formData.EmployeeId, this.formData)
            }
            this.showLoading = false
            if (!res.error) {
                const toast = {
                    title: this.$message.toast.titles.SUCCESS,
                    type: this.$enum.ToastType.SUCCESS,
                    message: this.$message.toast.messages.ADD_SUCCESS,
                    action: this.$message.toast.actions.UNDO
                }
                if (this.formMode == this.$enum.FormType.EDIT) {
                    toast.message = this.$message.toast.messages.EDIT_SUCCESS
                }
                this.$emitter.emit('addToast', toast)
                this.$emit('onSubmited')
                return true
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
            const res = await this.submit();
            const newCode = await employeeServices.getNewCode();
            if (res) this.formData = { ...this.defaultFormData, EmployeeCode: newCode }
        },
        /**
         * Kiểm tra form thay đổi chưa
         * Created by: dktuan (09/10/2023)
         */
        beforeClose() {
            if(this.$refs.form.checkChange()) 
                this.$refs.form.showDialog = true;
            else this.closeForm();
        },
        /**
         * emit cho component cha ẩn form
         * Created by: dktuan (19/08/2023)
         */
        closeForm() {
            this.$emit('closeForm')
            this.formData = {}
            // this.formData={...this.defaultFormData}
        },
        /**
         * tab vòng trở lại nút close
         * Created by: dktuan (19/08/2023)
         */
        tabToCloseBtn(e) {
            e.preventDefault();
            this.$refs.dialog.focusCloseButton();
        }
    },

    data() {
        return {
            items: [],
            selectedItem: null,
            showLoading: false,
            defaultFormData: {
                FullName: null,
                EmployeeCode: null,
                DateOfBirth: null,
                Gender: null,
                DepartmentId: null,
                IdentityNumber: null,
                IdentityDate: null,
                IdentityPlace: null,
                PositionName: null,
                Address: null,
                PhoneNumber: null,
                LandLineNumber: null,
                BankAccount: null,
                BankName: null,
                BankBranch: null,
                Email: null
            },
            formData: {
            }
        }

    },
    async created() {
        // Khởi tạo giá trị của form dựa trên chế độ thêm mới hoặc sửa
        if (this.formMode == this.$enum.FormType.ADD) {
            if (this.data != null) {
                this.formData = this.data;
            }
            else
                this.formData = this.defaultFormData
            const newCode = await employeeServices.getNewCode();
            this.formData.EmployeeCode = newCode
        }
        else {
            this.formData = this.data
        }

        // Gọi danh sách phòng ban
        this.items = await this.getDepartments();
    }
}
</script>

<style scoped>
@import url(./employee-list.css);

.layout {
    margin-bottom: 32px;
}
</style>