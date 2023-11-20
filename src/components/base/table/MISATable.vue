<template>
    <section class="content-section">
        <header class="table__header">
            <div class="select-action-wrapper" v-if="checkList.length > 0">
                <span>Đã chọn {{ checkList.length }}</span>
                <m-button @click="removeCheck" variant="outline">Bỏ chọn</m-button>
                <m-button prepend-icon="garbage-icon" variant="outline" @click="deleteMany">
                    Xóa tất cả
                </m-button>
            </div>
            <div class="search-empl" @keydown.enter="search">
                <div class="search-box">
                    <m-button tabindex="-1" title="Tìm kiếm" icon="search-icon" class="icon-search"
                        @click="search"></m-button>
                    <input v-model="searchString" class="text-input search-input" :placeHolder="searchPlaceHolder"
                        type="text">
                </div>
                <m-button icon="reload-icon" class="searchbar-icons" title="Làm mới"
                    @click="refreshRecords(recordPerPage, currentPage)"></m-button>
                <m-button @click="exportToExcel" icon="export-icon" title="Xuất file Excel"
                    class="searchbar-icons"></m-button>
            </div>
        </header>
        <div class="table-container">
            <table class="table">
                <tr class="table-header">
                    <th v-for="header in headers" :key="header.employeeCode"
                        :class="{ 'check-col': header.columnType === enums.ColumnType.CHECKBOX }" :title="header.tooltip">
                        <input v-if="header.columnType === enums.ColumnType.CHECKBOX" ref="checkAll" @input="setCheckAll"
                            class="checkbox" type="checkbox" name="check-all">
                        {{ header.title }}
                    </th>
                    <th class="edit-btn">Chức năng</th>
                </tr>
                <template v-for="(tdata, index) in data" :key="tdata.code">
                    <tr @dblclick="editRecord(index)">
                        <td v-for="(td, i) in headers" :key="td.code"
                            :class="{ 'check-col': td.columnType === enums.ColumnType.CHECKBOX }">
                            <div :class="{ 'tree-first-col': i == 0 }">
                                <input @input="handleCheck" class="checkbox" ref="check" type="checkbox" name="check-all"
                                    :value="tdata[idName]" v-if="td.columnType === enums.ColumnType.CHECKBOX">
                                <m-button @click="test(index)"
                                    :icon="expandBtns[index].isExpanded ? 'minus-icon' : 'plus-icon'" variant="whitebg"
                                    class="expand-btn"
                                    v-if="i == 0 && type === 'tree' && expandBtns[index]?.hasChildren"></m-button>
                                <span
                                    :class="{ 'tree-column': i == 0 && type === 'tree' && !expandBtns[index]?.hasChildren }">
                                    {{
                                        tdata[td.dataField]
                                    }}
                                </span>
                            </div>
                        </td>
                        <td class="blue-color edit-btn">
                            <div class="submenu-container">
                                <m-button @click="editRecord(index)" variant="whitebg" class="edit-button"> Sửa</m-button>
                                <m-button :id="'context-menu' + index" :outline="true" :index="index"
                                    class="context-menu-btn" icon="arrow-down-icon"></m-button>
                                <v-menu transition="slide-y-transition">
                                    <template #activator="{ props }">
                                        <label class="lb-context-menu" :for="'context-menu' + index" v-bind="props"></label>
                                    </template>
                                    <v-list>
                                        <v-list-item>
                                            <v-list-item-title @click="handleReplicate(index)">Nhân bản</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title @click="handleDelete(index)">Xóa</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item>
                                            <v-list-item-title>Ngừng sử dụng</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </td>
                    </tr>
                </template>
            </table>
            <div class="table--empty" v-if="data.length < 1">
                {{ noRecordMsg }}
            </div>
        </div>
        <m-loading v-if="showLoading"></m-loading>
        <div class="pagination">
            <div class="total">Tổng số: <strong>{{ totalRecords }}</strong> bản ghi</div>
            <div class="row-per-page">
                <v-menu v-model="open" ref="rowPerPage" transition="slide-y-transition">
                    <template #activator="{ props }">
                        <div class="row-per-page-selector" v-bind="props">
                            <span class="value">Số bản ghi/trang: <span class="number">{{ recordPerPage
                            }}</span></span>
                            <m-button icon="triangle-down-icon" :outline="!open" class="triangle-down-icon"></m-button>
                        </div>
                    </template>
                    <v-list @update:selected="changeRecordPerPage">
                        <v-list-item :class="{ 'v-list-item--active': recordPerPage == 10 }" :value="10">
                            <v-list-item-title :value="10">10 bản ghi/trang</v-list-item-title>
                        </v-list-item>
                        <v-list-item :class="{ 'v-list-item--active': recordPerPage == 20 }" :value="20">
                            <v-list-item-title>20 bản ghi/trang</v-list-item-title>
                        </v-list-item>
                        <v-list-item :class="{ 'v-list-item--active': recordPerPage == 30 }" :value="30">
                            <v-list-item-title>30 bản ghi/trang</v-list-item-title>
                        </v-list-item>
                        <v-list-item :class="{ 'v-list-item--active': recordPerPage == 50 }" :value="50">
                            <v-list-item-title>50 bản ghi/trang</v-list-item-title>
                        </v-list-item>
                        <v-list-item :class="{ 'v-list-item--active': recordPerPage == 100 }" :value="100">
                            <v-list-item-title>100 bản ghi/trang</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div class="current-page">
                <strong>{{ data.length > 0 ? (currentPage - 1) * recordPerPage + 1 : 0 }}</strong> -
                <strong>{{ (currentPage - 1) * recordPerPage + data.length }}</strong> bản ghi
            </div>
            <div class="page-container">
                <m-button @click="prevPage" icon="left-arrow-icon" :class="{ 'disabled': currentPage === 1 }"></m-button>
                <m-button @click="nextPage" icon="right-arrow-icon"
                    :class="{ 'disabled': currentPage === Math.ceil(totalRecords / recordPerPage) }"></m-button>
                <!-- <span @click="nextPage" class="icon right-arrow-icon"
                    :class="{ 'disabled': currentPage === Math.ceil(totalRecords / recordPerPage) }"></span> -->
            </div>
        </div>
    </section>
    <m-modal v-if="showDeleteDialog.isShow">
        <m-dialog title="Cảnh báo" @onClose="closeDeleteDialog" width="400px">
            <template #body>
                <div class="noti-content">
                    <span class="icon warning-icon"></span>
                    <div class="dialog-noti">
                        {{ deleteNoti }}
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button variant="outline" @click="closeDeleteDialog">Hủy</m-button>
                <m-button :autofocus="true" @click="handleAcceptDelete">Đồng ý</m-button>
            </template>
        </m-dialog>
    </m-modal>
</template>

<script>
import enums from '@/js/MISAEnum'
const deleteType = {
    ONE: 1,
    MANY: 2,
}
export default {
    name: "m-table",
    // props: ["searchPlaceHolder", "showLoading", "data", "totalRecords", "headers", "idName"],
    props: {
        searchPlaceHolder: String,
        showLoading: Boolean,
        data: Array,
        totalRecords: Number,
        headers: Object,
        idName: String,
        type: {
            type: String,
            default: "checkbox",
            validator: function (value) {
                return ['checkbox', 'tree'].indexOf(value) !== -1
            }
        }
    },
    emits: ["deleteMany", "deleteRecord", "editRecord", "loadNewPage", "refreshRecords", "exportToExcel", "replicate", "searchRecords"],
    methods: {
        test(index) {
            this.expandBtns[index] = {
                ...this.expandBtns[index],
                isExpanded: !this.expandBtns[index].isExpanded
            }
        },
        /**
         * emit sự kiện xuất khẩu excel
         * Created by: dktuan (29/09/2023)
         */
        exportToExcel() {
            this.$emit("exportToExcel", this.searchString)
        },
        /**
         * Tìm kiếm theo phân trang và từ khóa
         * Created by: dktuan (18/09/2023)
         */
        search() {
            this.$emit("searchRecords", this.recordPerPage, this.searchString)
        },
        /**
         * đổi số bản ghi trên trang
         * Created by: dktuan (4/09/2023)
         */
        changeRecordPerPage(e) {
            this.recordPerPage = e[0]
            if (this.currentPage > this.totalRecords / this.recordPerPage) {
                this.currentPage = Math.ceil(this.totalRecords / this.recordPerPage)
            }
        },
        /**
         * sửa đổi bản ghi
         * Created by: dktuan (14/09/2023)
         */
        editRecord(index) {
            this.$emit('editRecord', index)
        },
        /**
         * emit sự kiện xóa một hoặc nhiều
         * Created by: dktuan (14/09/2023)
         */
        emitDelete() {
            if (this.showDeleteDialog.type == deleteType.ONE) {
                this.$emit('deleteRecord', this.currentIndex, this.currentPage, this.recordPerPage)
            } else {
                this.$emit('deleteMany', this.checkList);
                this.removeCheck()
            }
        },
        /**
         * xóa 1 bản ghi
         * Created by: dktuan (14/09/2023)
         */
        handleDelete(index) {
            this.showDeleteDialog = {
                isShow: true,
                type: deleteType.ONE
            }
            this.currentIndex = index
            this.deleteNoti = this.$message.table.DELETE_ONE_CONFIRM
        },
        /**
         * xóa nhiều bản ghi
         * Created by: dktuan (14/09/2023)
         */
        deleteMany() {
            this.showDeleteDialog = {
                isShow: true,
                type: deleteType.MANY
            }
            this.deleteNoti = this.$message.table.DELETE_MANY_CONFIRM
        },
        /**
         * emit sự kiện nhân bản
         * Created by: dktuan (29/09/2023)
         */
        handleReplicate(index) {
            this.$emit('replicate', index)
        },
        /**
         * chuyển trang kế
         * Created by: dktuan (4/09/2023)
         */
        nextPage() {
            if (this.currentPage < Math.ceil(this.totalRecords / this.recordPerPage)) {
                this.currentPage += 1;
                this.$emit('loadNewPage', this.recordPerPage, this.currentPage, this.searchString)
            }
        },
        /**
         * chuyển trang trước
         * Created by: dktuan (4/09/2023)
         */
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.$emit('loadNewPage', this.recordPerPage, this.currentPage, this.searchString)
            }
        },
        /**
         * xử lý chọn checkbox
         * Created by: dktuan (4/09/2023)
         */
        handleCheck(e) {
            if (this.checkList.includes(e.target.value)) {
                this.checkList = this.checkList.filter(val => val !== e.target.value)
            }
            else this.checkList = [...this.checkList, e.target.value]
        },
        /**
         * bỏ chọn checkbox
         * Created by: dktuan (4/09/2023)
         */
        removeCheck() {
            this.checkList = []
            this.$refs.check.forEach(element => {
                element.checked = false
            });
        },
        /**
         * chọn tất cả checkbox
         * Created by: dktuan (4/09/2023)
         */
        setCheckAll() {
            if (this.$refs.checkAll.checked === true) {
                this.checkList = this.data.map(e => e.EmployeeId)
            } else {
                this.checkList = []
            }
            this.$refs.check.forEach(element => {
                element.checked = this.$refs.checkAll.checked
            });
        },
        /**
         * emit cho component cha làm mới các bản ghi
         * Created by: dktuan (19/08/2023)
         */
        refreshRecords(size, page) {
            this.$emit("refreshRecords", size, page)
        },
        /**
         * đóng dialog xác nhận xóa
         * Created by: dktuan (14/09/2023)
         */
        closeDeleteDialog() {
            this.showDeleteDialog.isShow = false
        },
        /**
         * xử lý khi ấn xác nhận ở dialog xóa
         * Created by: dktuan (14/09/2023)
         */
        handleAcceptDelete() {
            this.closeDeleteDialog()
            this.emitDelete()
        },

    },
    data() {
        return {
            showDeleteDialog: {
                isShow: false,
                type: deleteType.ONE
            },
            searchString: null,
            recordPerPage: 10,
            currentPage: 1,
            checkList: [],
            noRecordMsg: this.$message.table.NO_RECORD,
            deleteNoti: this.$message.table.DELETE_ONE,
            acceptDelete: false,
            currentIndex: -1,
            open: false,
            expandBtns: [],
            enums: enums
        }
    },
    watch: {
        /**
         * Xử lý hiển thị nút chọn tất cả
         * @param {Array} newVal 
         * Created by: dktuan (14/09/2023)
         */
        checkList(newVal) {
            if (newVal.length < this.data.length) {
                this.$refs.checkAll.checked = false
            } else {
                this.$refs.checkAll.checked = true
            }
        },
        /**
         * Xử lý khi thay đổi số bản ghi trên trang
         * @param {Number} newVal 
         * @param {Number} oldVal 
         * Created by: dktuan (14/09/2023)
         */
        recordPerPage(newVal, oldVal) {
            if (!newVal) {
                this.recordPerPage = oldVal
            }
            else if (newVal != oldVal) {
                this.$emit('loadNewPage', newVal, this.currentPage, this.searchString)
            }
        },
        data(newVal) {
            console.log(newVal)
        }
    },
    mounted() {
        this.data.forEach((e, index) => {
            if (e?.Children && e.Children.length > 0) {
                this.expandBtns[index] = {
                    hasChildren: true,
                    isExpanded: false,
                }
            } else {
                this.expandBtns[index] = {
                    hasChildren: false,
                }
            }
        })
    },
}
</script>

<style scoped>@import url(./table.css);</style>