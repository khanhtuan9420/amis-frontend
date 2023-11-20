<template>
    <section @click="console.log(data)" class="table-wrapper" :class="{ 'full': size === 'full', 'allow-overflow': overflow }">
        <header class="table__header" v-if="showHeader">
            <v-menu transition="slide-y-transition" v-if="checkList.length > 1">
                <template #activator="{ props }">
                    <div class="select-action-wrapper" v-bind="props">
                        <m-button variant="outline" appendIcon="triangle-down-icon">Thực hiện hàng loạt</m-button>
                    </div>
                </template>
                <v-list>
                    <v-list-item>
                        <v-list-item-title  @click="deleteMany">Xóa</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Gộp</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <div class="expand-option" @click="handleTogleExpandAll">
                <span v-if="cloneTableType == config.$enum.TableType.TREE">Mở rộng</span>
                <span v-if="cloneTableType == config.$enum.TableType.TREE_EXPANDED">Thu gọn</span>
            </div>
            <div class="search-empl" @keydown.enter="search">
                <div class="search-box">
                    <m-button tabindex="-1" title="Tìm kiếm" icon="search-icon" class="icon-search"
                        @click="search"></m-button>
                    <input v-model="searchString" class="text-input search-input" :placeHolder="searchPlaceHolder"
                        type="text">
                </div>
                <m-button icon="reload-icon" class="searchbar-icons" title="Làm mới" @click="refreshRecords"></m-button>
                <m-button @click="exportToExcel" icon="export-icon" title="Xuất file Excel"
                    class="searchbar-icons"></m-button>
            </div>
            <slot name="postTableHeader"></slot>
        </header>
        <div class="table-container" ref="table" @scroll="handleScroll">
            <table class="table">
                <tr class="table-header">
                    <th v-for="header in headers" :key="header.employeeCode" :class="{
                        'check-col': header.columnType === config.$enum.ColumnType.CHECKBOX,
                        'align-right': header.dataType === Number,
                        'align-center': header.dataType === Date || header.columnType === config.$enum.ColumnType.INDEX,
                        'align-left': header.dataType === String,
                        'edit-btn': header.columnType === config.$enum.ColumnType.CONTEXT_MENU_1 ||
                            header.columnType === config.$enum.ColumnType.CONTEXT_MENU_2 ||
                            header.columnType === config.$enum.ColumnType.CONTEXT_MENU_3
                    }" :title="header.tooltip">
                        <input v-if="header.columnType === config.$enum.ColumnType.CHECKBOX" ref="checkAll"
                            @click="setCheckAll" class="checkbox" type="checkbox" name="check-all">
                        <span v-if="header.columnType === config.$enum.ColumnType.INDEX">#</span>
                        {{ header.title }}
                    </th>
                </tr>
                <template v-for="(tdata, index) in processedData" :key="tdata?.code">
                    <m-table-row @handleDelete="handleDeleteByRow" @selectRow="selectRow" @toggleChildren="toggleChildren" :isCheckAll="isCheckAll" :isCheckAllBtnClicked="isCheckAllBtnClicked"
                        :selectedId="selectedId" :tableType="cloneTableType" :index="index" :headers="headers"
                        :isAlwaysExpand="isAlwaysExpand" :row="tdata" :mode="mode" :IdField="IdField"
                        :valueField="valueField"></m-table-row>
                </template>
                <slot name="extraRow"></slot>
            </table>
            <div class="table--empty" v-if="data.length < 1 && !showLoading">
                {{ noRecordMsg }}
            </div>
        </div>
        <m-loading v-if="showLoading"></m-loading>
        <div class="pagination" v-if="showFooter">
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
    <m-modal v-if="showDialogObj.isShow">
        <m-dialog title="Cảnh báo" @onClose="closeDeleteDialog" width="400px">
            <template #body>
                <div class="noti-content">
                    <span class="icon warning-icon"></span>
                    <div class="dialog-noti">
                        {{ dialogNoti }}
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
import { config } from '@/main'
import helper from '@/js/MISAHelper'
const deleteType = {
    ONE: 1,
    MANY: 2,
}
const command = {
    DELETE: 1,
    CHANGE_ACTIVE: 2,
}
export default {
    name: "m-table",
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
        },
        mode: {
            type: Number,
            validator: function (value) {
                return [config.$enum.TableMode.VIEW, config.$enum.TableMode.EDIT].indexOf(value) !== -1
            }
        },
        size: {
            type: String,
            default: "default",
            validator: function (value) {
                return ['default', 'full'].indexOf(value) !== -1
            }
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        tableType: {
            type: Number,
            validator: function (value) {
                return [config.$enum.TableType.FLAT, config.$enum.TableType.TREE, config.$enum.TableType.TREE_EXPANDED]
                    .indexOf(value) !== -1
            }
        },
        selectedId: {
            type: String,
        },
        IdField: {
            type: String,
        },
        valueField: String,
        parentIdField: String,
        tableName: String,
        overflow: Boolean,
    },
    emits: ["deleteMany", "deleteRecord", "editRecord", "loadNewPage", "refreshRecords", "exportToExcel", "replicate", "searchRecords",
        'getChildren'],
    methods: {
        selectRow(val) {
            this.$emit('selectRow', val)
        },
        /**
         * Gọi api lấy các bản ghi con của bản ghi cha
         * @param {*} row 
         * Created by: dktuan (06/11/2023)
         */
        toggleChildren(row) {
            this.$emit('getChildren', row, this.searchString)
        },
        /**
         * Xử lý gọi api khi scroll đến cuối
         * @param {*} row 
         * Created by: dktuan (06/11/2023)
         */
        handleScroll() {
            if (Math.ceil(this.$refs.table.scrollTop + this.$refs.table.clientHeight) >= this.$refs.table.scrollHeight
                && this.$refs.table.scrollHeight >= 149) {
                this.$emit('callApi')
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
            if (this.showFooter) {
                this.$emit("loadNewPage", this.searchString, this.recordPerPage, this.currentPage)
            } else {
                this.$emit("loadNewPage", this.searchString, null, null)
            }
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
        emitDelete(row) {
            console.log(row, this.showDialogObj.type)
            if (row) {
                this.$emit('deleteRecordByRow', row)
                return
            }
            if (this.showDialogObj.type == deleteType.ONE) {
                this.$emit('deleteRecord', this.currentIndex, this.currentPage, this.recordPerPage)
            } else {
                this.$emit('deleteMany', this.checkList);
                // this.removeCheck()
            }
        },
        /**
         * xóa 1 bản ghi
         * Created by: dktuan (14/09/2023)
         */
        handleDelete(index) {
            this.dialogType = command.DELETE
            this.showDialogObj = {
                isShow: true,
                type: deleteType.ONE
            }
            this.currentIndex = index
            this.dialogNoti = this.$message.table.DELETE_ONE_CONFIRM
        },
        handleDeleteByRow(value) {
            this.dialogType = command.DELETE
            this.showDialogObj = {
                isShow: true,
                type: deleteType.ONE
            }
            this.dialogNoti = this.$message.table.DELETE_ONE_CONFIRM
            this.rowAction = value
        },
        /**
         * xóa nhiều bản ghi
         * Created by: dktuan (14/09/2023)
         */
        deleteMany() {
            this.dialogType = command.DELETE
            this.showDialogObj = {
                isShow: true,
                type: deleteType.MANY
            }
            this.dialogNoti = this.$message.table.DELETE_MANY_CONFIRM
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
                this.$emit("loadNewPage", this.searchString, this.recordPerPage, this.currentPage)
            }
        },
        /**
         * chuyển trang trước
         * Created by: dktuan (4/09/2023)
         */
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage -= 1;
                this.$emit("loadNewPage", this.searchString, this.recordPerPage, this.currentPage)
            }
        },
        /**
         * xử lý chọn checkbox
         * Created by: dktuan (4/09/2023)
         */
        handleCheck(row) {
            this.isCheckAllBtnClicked=false
            if (this.checkList.includes(row[this.IdField])) {
                this.checkList = this.checkList.filter(val => val !== row[this.IdField])
            }
            else this.checkList = [...this.checkList, row[this.IdField]]
            console.log(this.checkList)
        },
        /**
         * bỏ chọn checkbox
         * Created by: dktuan (4/09/2023)
         */
        removeCheck() {
            this.$refs.checkAll[0].checked = false
            this.isCheckAll = false
            // this.checkList = []
            // this.$refs.check.forEach(element => {
            //     element.checked = false
            // });
        },
        /**
         * chọn tất cả checkbox
         * Created by: dktuan (4/09/2023)
         */
        setCheckAll(e) {
            this.isCheckAllBtnClicked = true
            if (e.target.checked) {
                this.isCheckAll = true
                this.checkList = this.data.map(e => e[this.IdField])
            } else {
                this.isCheckAll = false
                this.checkList = []
            }
        },
        /**
         * emit cho component cha làm mới các bản ghi
         * Created by: dktuan (19/08/2023)
         */
        refreshRecords() {
            this.$emit("loadNewPage", this.searchString, this.recordPerPage, this.currentPage)
        },
        /**
         * đóng dialog xác nhận xóa
         * Created by: dktuan (14/09/2023)
         */
        closeDeleteDialog() {
            if (this.dialogType == command.CHANGE_ACTIVE) {
                this.$emit('toggleActive', this.rowAction, false)
            }
            this.showDialogObj.isShow = false
        },
        /**
         * xử lý khi ấn xác nhận ở dialog xóa
         * Created by: dktuan (14/09/2023)
         */
        handleAcceptDelete() {
            if (this.dialogType == command.DELETE) {
                this.emitDelete(this.rowAction)
            } else if(this.dialogType == command.CHANGE_ACTIVE) {
                this.$emit('toggleActive', this.rowAction, true)
            } 
            this.showDialogObj.isShow = false
        },
        handleTogleExpandAll() {
            if (this.cloneTableType === config.$enum.TableType.TREE_EXPANDED) {
                this.cloneTableType = config.$enum.TableType.TREE
            } else this.cloneTableType = config.$enum.TableType.TREE_EXPANDED
        },
        async toggleActive(row) {
            if (row[this.parentIdField] && !row.Active) {
                for (const r of this.data) {
                    if (r[this.IdField] === row[this.parentIdField] && !r.Active) {
                        this.$emitter.emit('openErrorDialog', {
                            type: this.$enum.ToastType.ERROR,
                            show: true,
                            msg: [`${this.tableName} cha đang ở trạng thái "Ngừng sử dụng". Bạn không thể thiết lập trạng thái "Sử dụng" cho ${this.tableName} con`]
                        })
                        return
                    }
                }
            }
            this.dialogType = command.CHANGE_ACTIVE
            if (!row.Active) {
                this.rowAction = row
                this.dialogNoti = `Bạn có muốn thiết lập trạng thái "Sử dụng" cho tất cả <${this.tableName}> con không?`
                this.showDialogObj = {
                    isShow: true,
                }
            } else this.$emit('toggleActive', row, false)
        }
    },
    data() {
        return {
            showDialogObj: {
                isShow: false,
                type: deleteType.ONE
            },
            dialogType: null,
            searchString: null,
            recordPerPage: this.showFooter ? 20 : null,
            currentPage: this.showFooter ? 1 : null,
            checkList: [],
            noRecordMsg: this.$message.table.NO_RECORD,
            dialogNoti: this.$message.table.DELETE_ONE,
            acceptDelete: false,
            currentIndex: -1,
            open: false,
            expandBtns: [],
            config: config,
            processedData: [],
            isAlwaysExpand: null,
            cloneTableType: this.tableType,
            rowAction: null,
            isCheckAll: false,
            isCheckAllBtnClicked: false,
        }
    },
    watch: {
        /**
         * Xử lý hiển thị nút chọn tất cả
         * @param {Array} newVal 
         * Created by: dktuan (14/09/2023)
         */
        checkList(newVal) {
            if (newVal.length != this.data.length) {
                // if(this.isCheckAllBtnClicked) {
                // }
                this.isCheckAll = false
                this.$refs.checkAll[0].checked = false
                console.log(this.isCheckAll)
            } else {
                this.isCheckAll = true
                this.$refs.checkAll[0].checked = true
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
                this.$emit('loadNewPage', this.searchString, newVal, this.currentPage)
            }
        },
        /**
         * Xử lý chuyển dữ liệu phẳng sang dữ liệu cây
         * @param {Array} newVal 
         * Created by: dktuan (06/11/2023)
         */
        data(newVal) {
            if (newVal != null) {
                if (this.type == 'tree') {
                    if (this.tableType != config.$enum.TableType.TREE_EXPANDED) {
                        this.processedData = helper.transformData(newVal, this.valueField)
                    } else this.processedData = newVal
                    this.processedData.forEach((e, index) => {
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
                }
                else this.processedData = newVal
            }
        }
    },
    mounted() {
        this.$emitter.on('toggleActive', this.toggleActive)
        if (this.headers[0].columnType === config.$enum.ColumnType.CHECKBOX) {
            this.$emitter.on('checkRecord', this.handleCheck)
        }
        this.$emit('loadNewPage', this.searchString, this.recordPerPage, this.currentPage)
        if (this.tableType === config.$enum.TableType.TREE_EXPANDED) {
            this.processedData = [...this.data]
        }
        if (this.tableType === config.$enum.TableType.TREE) this.isAlwaysExpand = false
        else this.isAlwaysExpand = true
        this.processedData = [...this.data]
    },
    unmounted() {
        this.$emitter.off('toggleActive', this.toggleActive)
        if (this.headers[0].columnType === config.$enum.ColumnType.CHECKBOX) {
            this.$emitter.off('checkRecord', this.handleCheck)
        }
    }
}
</script>

<style scoped>
@import url(./table.css);
</style>