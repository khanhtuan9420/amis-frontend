<template>
    <section class="header-section">
        <h3>Nhân viên</h3>
        <m-button @click="addEmpl">Thêm nhân viên mới</m-button>
    </section>
    <m-table @replicate="replicate" @exportToExcel="exportToExcel" @deleteMany="deleteMany" @deleteRecord="deleteRecord"
     @editRecord="editRecord" @loadNewPage="getEmployees" ref="table" :headers="tableHeader" :totalRecords="totalRecords"
      :data="tableDatas" @refreshRecords="refresh" :idName="'EmployeeId'" :showLoading="showLoading"
      @searchRecords="searchRecords" 
      :searchPlaceHolder="'Tìm theo mã, tên nhân viên'">
    </m-table>
    <EmployeeForm :data="formData" :formMode="formMode" @onSubmited="refresh" @closeForm="closeForm" v-if="showDialog" />
</template>

<script>
import helper from '@/js/MISAHelper';
import EmployeeForm from './EmployeeForm.vue';
import * as employeeServices from '@/services/employee-services'

export default {
    name: "EmployeeList",
    components: { EmployeeForm },
    methods: {
        /**
         * Xuất khẩu excel
         * @param {String} searchString 
         * Created by: dktuan (29/09/2023)
         */
        async exportToExcel(searchString) {
            this.showLoading=true
            const res = await employeeServices.exportExcel(searchString);
            this.showLoading=false
            return res;
        },
        /**
         * sửa đổi bản ghi
         * @param {Number} index
         * Created by: dktuan (14/09/2023)
         */
        async editRecord(index) {
            let data = {...this.tableDatas[index]}
            // data = this.$helper.reverseDate(data, 'DateOfBirth', 'IdentityDate');
            this.formData = data
            this.showDialog = true;
            this.formMode = this.$enum.FormType.EDIT
        },
        /**
         * xóa bản ghi
         * @param {Number} currentPage 
         * @param {Number} index 
         * @param {Number} pageSize 
         * Created by: dktuan (14/09/2023)
         */
        async deleteRecord(index, currentPage, pageSize) {
            try {
                const res = await employeeServices.deleteEmployee(this.tableDatas[index].EmployeeId);
                this.getEmployees(pageSize, currentPage)
                const toast = {
                    title: this.$message.toast.titles.SUCCESS,
                    type: this.$enum.ToastType.SUCCESS,
                    message: this.$message.toast.messages.DELETE_SUCCESS,
                }
                this.$emitter.emit('addToast', toast)
                this.totalRecords = this.totalRecords - 1;
                this.refresh()
                return res;
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * Xóa nhiều bản ghi dựa trên mảng các id
         * @param {Array<String>} ids 
         * Created by: dktuan (21/09/2023)
         */
        async deleteMany(ids) {
            try {
                const res = await employeeServices.deleteManyEmployees(ids);
                const toast = {
                    title: this.$message.toast.titles.SUCCESS,
                    type: this.$enum.ToastType.SUCCESS,
                    message: this.$message.toast.messages.DELETE_MANY_SUCCESS,
                }
                this.totalRecords = this.totalRecords - ids.length;
                this.$emitter.emit('addToast', toast)
                this.refresh()
                return res;
            } catch (error) {
                console.log(error)
            }
        },
        /**
         * Nhân bản 1 bản ghi
         * @param {Number} index 
         */
        replicate(index) {
            let data = this.tableDatas[index]
            // data = this.$helper.reverseDate(data, 'DateOfBirth', 'IdentityDate');
            this.formData = data
            this.showDialog = true;
            this.formMode = this.$enum.FormType.ADD
        },
        /**
         * Fetch dữ liệu danh sách nhân viên
         * @param {String} key 
         * @param {Number} page 
         * @param {Number} size 
         * Created by: dktuan (30/08/2023)
         */
        async getEmployees(size, page, key) {
            this.page = page;
            this.pageSize = size;
            this.showLoading = true
            let res = await employeeServices.getEmployees(size, page, key);
            if(res.error) return
            let {Data, TotalRecords} = res
            Data = [...helper.formatDate(Data, 'DateOfBirth', 'IdentityDate')];
            this.totalRecords = TotalRecords
            this.showLoading = false

            this.tableDatas = Data
            this.totalRecords = TotalRecords
        },
        /**
         * refresh các bản ghi
         * @param {Number} page 
         * @param {Number} size 
         * Created by: dktuan (19/08/2023)
         */
        async refresh(size, page) {
            if(size && page) {
                await this.getEmployees(size, page)
            } else {
                await this.getEmployees(this.pageSize, this.page)
            }
        },
        /**
         * Tìm kiếm bản ghi
         * @param {Number} size 
         * @param {String} key
         * Created by: dktuan (21/09/2023) 
         */
        async searchRecords(size, key) {
            await this.getEmployees(size, 1, key)
            this.$refs.table.currentPage = 1
        },
        /**
         * Mở form thêm nhân viên
         * Created by: dktuan (19/08/2023)
         */
        addEmpl() {
            this.showDialog = true;
            this.formMode = this.$enum.FormType.ADD
        },
        /**
         * Đóng form
         * Created by: dktuan (19/08/2023)
         */
        closeForm() {
            this.showDialog = false;
            this.formData = {};
        },
    },
    data() {
        return {
            page: -1,
            pageSize: -1,
            tableHeader: {
                EmployeeCode: {
                    title: "Mã nhân viên"
                },
                FullName: {
                    title: "Tên nhân viên"
                },
                GenderName: {
                    title: "Giới tính"
                },
                DateOfBirth: {
                    title: "Ngày sinh",
                    type: 'date',
                    class: "tb-center"
                },
                IdentityNumber: {
                    title: "Số CMND",
                    tooltip: "Số chứng minh nhân dân"
                },
                PositionName: {
                    title: "Chức danh",
                },
                DepartmentName: {
                    title: "Tên đơn vị",
                },
                BankAccount: {
                    title: "Số tài khoản"
                },
                BankName: {
                    title: "Tên ngân hàng"
                },
                BankBranch: {
                    title: "Chi nhánh TK ngân hàng",
                    tooltip: "Chi nhánh tài khoản ngân hàng"
                }
            },
            formData: null,
            formMode: null,
            showLoading: false,
            tableDatas: [],
            totalRecords: 0,
            showDialog: false,
            checkState: {
                isCheckAll: false,
                checkCount: 0,
            }
        };
    },
    async mounted() {
        await this.getEmployees(this.$refs.table.recordPerPage, this.$refs.table.currentPage)
    },
}
</script>

<style scoped></style>