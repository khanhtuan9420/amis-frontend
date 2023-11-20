<template>
    <div class="label">
        <label v-if="label && !inCell" :title="labelTitle" class="label-name" for="">{{ label }}</label>
        <div v-if="isRequired && showRequired" class="required">*</div>
    </div>
    <tippy v-tippy="{ placement: 'bottom' }">
        <div class="combobox-wrapper" :class="{ error: error, 'combobox-disabled': disabled }" @click="console.log(modelValue)">
            <template v-if="!inCell">
                <m-loading class="first-loading" v-if="!disabled && items === null"></m-loading>
                <input :id="comboboxId" @click="test" ref="input" :tabindex="disabled ? -1 : 0" @focusin="filterOptions"
                    type="text" :value="selectedItem" @input="searchAndFilterOptions" @blur="clearResults"
                    @keydown.down="highlightNext" @keyup.up="highlightPrevious" @keyup.enter="confirmSelection" />
                <m-button :data="comboboxId" tabindex="-1" @click="expandOptions" class="expand-icon" icon="down-arrow-icon"
                    :class="{ 'flip': arrowFlip }"></m-button>
                <div :data="comboboxId" ref="listItem" v-if="filteredOptions.length > 0"
                    class="list-wrapper list-wrapper-table">
                    <m-table-tree @callApi="infiniteScroll" @selectRow="handleSelectRow" :selectedId="currentId"
                        :idName="idField" :type="type" :tableType="tableType" :showHeader="false"
                        :mode="config.$enum.TableMode.VIEW" :valueField="valueField" :showFooter="false"
                        :data="processedData" :headers="column"></m-table-tree>
                    <li class="loading-item" v-if="isLoading">
                        <m-loading></m-loading>
                    </li>
                </div>
            </template>
            <tippy ref="tippy" v-if="inCell" v-tippy="{
                trigger: 'manual', placement: 'bottom-start', flip: true, interactive: true,
                flipBehavior: ['bottom-start', 'bottom-end'],
                appendTo: () => document.body, hideOnClick: true
            }">
                <m-loading class="first-loading" v-if="!disabled && items === null"></m-loading>
                <input :id="comboboxId" @click="test" ref="input" :tabindex="disabled ? -1 : 0" @focusin="filterOptions"
                    type="text" :value="selectedItem" @input="searchAndFilterOptions" @blur="clearResults"
                    @keyup.down="highlightNext" @keyup.up="highlightPrevious" @keyup.enter="confirmSelection" />
                <m-button :data="comboboxId" tabindex="-1" @click="expandOptions" class="expand-icon" icon="down-arrow-icon"
                    :class="{ 'flip': arrowFlip }"></m-button>

                <template #content>
                    <div @click="hideTippy" :data="comboboxId" ref="listItem" v-if="filteredOptions.length > 0 || true"
                        class="list-wrapper list-wrapper-table tippy">
                        <m-table-tree @callApi="infiniteScroll" @selectRow="handleSelectRow" :selectedId="currentId"
                            :idName="idField" :type="type" :tableType="tableType" :showHeader="false"
                            :mode="config.$enum.TableMode.VIEW" :valueField="valueField" :showFooter="false"
                            :data="processedData" :headers="column"></m-table-tree>
                        <!-- <li class="loading-item" v-if="isLoading">
                            <m-loading></m-loading>
                        </li> -->
                    </div>
                </template>
            </tippy>
        </div>
        <template #content>
            <div v-if="error" :title="errorMessage" class="error-message">{{ errorMessage }}</div>
        </template>
    </tippy>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { config } from '@/main';
import helper from '@/js/MISAHelper';
let isApiCalled = true;
export default {
    emits: ["getData", "update:modelValue"],
    computed: {
        comboboxId() {
            return uuidv4()
        },
        currentId() {
            return this.processedData[this.index]?.[this.valueField]
        }
    },
    props: {
        showRequired: {
            type: Boolean,
            default: true,
        },
        callAtMount: {
            type: Boolean,
            default: true,
        },
        inCell: Boolean,
        label: String,
        labelTitle: String,
        isRequired: Boolean,
        items: Object,
        modelValue: null,
        modelText: null,
        disabled: {
            type: Boolean,
            default: false,
        },
        idField: String,
        valueField: String,
        parentRow: null,
        tableType: null,
        type: String,
        column: Array,
        name: String,
        isGetAll: {
            type: Boolean,
            default: false,
        },
        bindToAnotherField: null,
        
    },
    data() {
        return {
            index: -1,
            fullData: [],
            selectedItem: null,
            myItems: [], // Đưa danh sách các tùy chọn vào đây
            filteredOptions: [],
            highlightedIndex: -1,
            error: false,
            errorMessage: "",
            isLoading: false,
            arrowFlip: false,
            clickExpandBtn: false,
            map: {},
            config: config,
            processedData: [],
            page: 1,
            pageSize: 7,
            isGotAll: false,
            isLoadMore: true,
            searchString: null,
            document: document,
            isCalledAtMount: this.callAtMount,
        };
    },
    methods: {
        test() {
            // if (this.inCell) {
            //     this.processedData = [...this.fullData]
            // }
        },
        hideTippy() {
            // console.log(this.$refs.tippy)
            setTimeout(() => {
                if (this.$refs.tippy) {
                    this.$refs.tippy.hide()
                }
            }, 300)
        },
        /**
         * Chuyển dữ liệu phẳng sang dạng cây
         * @param {Array} input 
         * Created by: dktuan (07/11/2023)
         */
        transformData(input) {
            let res = input
            if (this.tableType === this.$enum.TableType.TREE)
                res = helper.transformData(input, this.valueField)
            console.log(res)
            return res
        },
        /**
         * Hiển thị danh sách lựa chọn dựa vào input mà user nhập
         * Created by: dktuan (21/09/2023)
         */
        filterOptions() {
            if (this.inCell) this.$refs.tippy.show()
            if (this.disabled) return
            this.arrowFlip = true;
            this.filteredOptions = this.myItems
            if (this.inCell || this.isGetAll) {
                this.processedData = this.fullData.filter(e => {
                    return e[this.valueField].includes(this.selectedItem)
                })
                if (this.processedData.length == 0) {
                    this.processedData = this.fullData
                } else if (this.selectedItem && !this.error) {
                    console.log('231')
                    this.index = 0
                }
            }
            // this.highlightedIndex = -1;
        },
        /**
         * Tìm kiếm và lọc data
         * @param {*} e 
         * Created by: dktuan (07/11/2023)
         */
        searchAndFilterOptions(e) {
            this.page = 1
            this.index = -1
            console.log(this.index)
            this.isLoadMore = false
            this.searchString = e.target.value
            this.selectedItem = e.target.value
            this.validate()
            if (!this.inCell && !this.isGetAll) {
                this.$emit('getData', this.searchString, this.pageSize, this.page)
            }
            this.filterOptions()
            console.log(this.index)

        },
        /**
         * Ẩn danh sách lựa chọn
         * Created by: dktuan (21/09/2023)
         */
        clearResults() {
            if (this.inCell) this.hideTippy()
            setTimeout(() => {
                if (!this.clickExpandBtn) this.arrowFlip = false
                this.filteredOptions = [];
            }, 400);
        },
        /**
         * Lựa chọn phần tử dựa trên danh sách gợi ý
         * @param {int} index 
         * Created by: dktuan (21/09/2023)
         */
        selectOption(index) {
            if (index >= 0 && index < this.filteredOptions.length) {
                // this.selectedItem = this.filteredOptions[index];
                this.filteredOptions = [];
            }
        },
        /**
         * Highlight lựa chọn tiếp theo
         * Created by: dktuan (21/09/2023)
         */
        highlightNext() {
            if (this.index < this.processedData.length - 1) {
                this.index = this.index + 1
                this.searchString = null
            }
            if (this.highlightedIndex < this.filteredOptions.length - 1) {
                this.highlightedIndex++;
            }
            setTimeout(() => console.log(this.index), 2000)
        },
        /**
         * Highlight lựa chọn trước
         * Created by: dktuan (21/09/2023)
         */
        highlightPrevious() {
            if (this.index > 0) this.index--;
            if (this.highlightedIndex > 0) {
                this.highlightedIndex--;
                this.searchString = null
            }
        },
        /**
         * Xác nhận lựa chọn khi người dùng ấn Enter
         * Created by: dktuan (21/09/2023)
         */
        confirmSelection() {
            if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length) {
                this.selectOption(this.highlightedIndex);
                this.$emit('update:modelValue', this.myItems[this.index][this.idField])
            }
            if (this.inCell) this.hideTippy()
        },
        /**
         * Validate input
         * Created by: dktuan (21/09/2023)
         */
        validate() {
            console.log('day')
            if (this.isRequired && !this.selectedItem) {
                console.log('1')
                this.error = true;
                this.index=-1
                this.errorMessage = config.$message.form.input.required(this.label)
                return
            }
            if (this.selectedItem && !this.myItems[this.index]) {
                console.log('2')
                this.error = true;
                this.index=-1
                this.errorMessage = config.$message.form.input.combobox(this.label)
                return
            }
            this.error = false
        },
        /**
         * Đăng ký vào Fomr (component cha) để validate trước khi submit
         * Created by: dktuan (21/09/2023)
         */
        register() {
            this.$emitter.emit('registerField', this);
        },
        /**
         * Focus vào thẻ input
         * Created by: dktuan (21/09/2023)
         */
        focus() {
            this.$refs.input.focus();
        },
        /**
         * Hiển thị / ẩn option
         * Created by: dktuan (21/09/2023)
         */
        expandOptions() {
            if (this.disabled) return
            this.arrowClicked = true; // Đặt biến spanClicked thành true khi nhấp vào span
            this.arrowFlip = !this.arrowFlip;
        },
        /**
         * Xử lý cuộn vô hạn, gọi API lấy thêm data
         * Created by: dktuan (24/10/2023)
         */
        infiniteScroll() {
            this.isLoadMore = true
            if (!this.isGotAll) {
                this.isLoading = true;
                if (!isApiCalled && !this.isGetAll) {
                    isApiCalled = true;
                    this.$emit('getData', this.searchString, this.pageSize, this.page + 1)
                    this.page += 1
                }
            }
        },
        /**
         * Xác định index trong mảng phẳng của row được chọn
         * @param {Object} row 
         * Created by: dktuan (07/11/2023)
         */
        handleSelectRow(row) {
            console.log(row)
            let i = -1;
            for (const val of this.processedData) {
                i++;
                if (val[this.idField] === row[this.idField]) {
                    this.index = i
                    console.log(this.index)
                    break;
                }
            }
        }
    },
    created() {
    },
    mounted() {
        // Hiển thị giá trị cho combobox khi ở form sửa
        if (this.parentRow) {
            this.myItems = [this.parentRow, ...this.myItems]
            this.selectedItem = this.parentRow[this.valueField]
            // this.index=0
        }
        if (this.callAtMount) {
            this.isCalledAtMount = this.callAtMount
            this.$emit('getData', null, this.pageSize, this.page)
        }
        this.register();
        // Xử lý khi người dùng blur khỏi combobox
        window.addEventListener('click', (e) => {
            this.clickExpandBtn = (e.target?.__vnode && e.target.__vnode?.props && e.target.__vnode.props.data === this.comboboxId) ||
                e.target.__vueParentComponent && e.target.__vueParentComponent?.props?.data === this.comboboxId
        })
    },
    unmounted() {
    },
    watch: {
        index(newVal, oldVal) {
            if (this.error && newVal != null && newVal > -1) {
                this.error = false
            }
            if (oldVal > -1 && newVal == -1) {
                this.error = true
                this.errorMessage = config.$message.form.input.combobox(this.label)
            }
        },
        /**
         * update giá trị được chọn lên giao diện
         * @param {Object} newVal 
         * Created by: dktuan (07/11/2023)
         */
        currentId(newVal) {
            if (newVal) this.selectedItem = newVal
        },
        /**
         * Xử lý sự kiện icon expand arrow
         * @param {Boolean} newVal
         * @param {Boolean} oldVal 
         * Created by: dktuan (24/10/2023)
         */
        arrowFlip(newVal, oldVal) {
            if (oldVal == false && newVal == true) {
                this.$refs.input.focus();
            }
        },
        /**
         * Cập nhật danh sách lựa chọn
         * @param {Object} newVal 
         * Created by: dktuan (21/09/2023)
         */
        items(newVal) {
            if (newVal) {
                if (this.inCell || this.isGetAll) this.fullData = newVal
                if (newVal && newVal.length === 0) {
                    this.isGotAll = true;
                }
                this.isLoading = false
                isApiCalled = false
                if (this.isLoadMore) {
                    this.processedData = [...this.processedData, ...this.transformData(newVal)]
                    this.myItems = [...this.myItems, ...newVal]
                }
                else {
                    this.processedData = [...this.transformData(newVal)]
                    this.myItems = [...newVal]
                }
                if (this.modelValue && this.index == -1 && this.searchString == null) {
                    let i = -1
                    for (const e of this.processedData) {
                        i++
                        if (e[this.idField] == this.modelValue) {
                            this.index = i
                            break
                        }
                    }
                }
            }
        },
        /**
         * validate khi nhập liệu và binding với form
         * @param {Object} newVal 
         * Created by: dktuan (21/09/2023)
         */
        selectedItem(newVal) {
            console.log(newVal, this.index)
            if (this.myItems[this.index]) {
                if (!this.bindToAnotherField && !this.inCell) {
                    this.$emit('update:modelValue', this.myItems[this.index][this.idField])
                } else {
                    let data = []
                    if (this.bindToAnotherField) {
                        for (const e of this.bindToAnotherField) {
                            data.push({
                                key: e,
                                value: this.myItems[this.index][e]
                            })
                        }
                    }
                    this.$emit('inputChange', this.myItems[this.index][this.idField], data)
                }
            } else {
                if (!this.bindToAnotherField && !this.inCell) {
                    this.$emit('update:modelValue', null)
                }
                else {
                    let data = []
                    if (this.bindToAnotherField) {
                        for (const e of this.bindToAnotherField) {
                            data.push({
                                key: e,
                                value: null
                            })
                        }
                    }
                    this.$emit('inputChange', null, data)
                    console.log('ôkok')
                }
            }
        },
        /**
         * reset lại index và trang hiện tại khi tìm kiếm
         * Created by: dktuan (07/11/2023)
         */
        searchString(newVal, oldVal) {
            if (!(!newVal && oldVal != null)) {
                this.page = 1
                this.index = -1
            }
        },
        modelValue(newVal) {
            console.log(newVal)
            if(this.myItems[this.index]) {
                console.log(this.myItems[this.index][this.idField], newVal)
            }
            if (newVal == null) {
                this.index=-1
                console.log(this.selectedItem)
                let data = []
                if (this.bindToAnotherField) {
                    for (const e of this.bindToAnotherField) {
                        data.push({
                            key: e,
                            value: null
                        })
                    }
                }
                this.$emit('inputChange', null, data)
            }
            if (this.isCalledAtMount) {
                let i = -1
                for (const e of this.processedData) {
                    i++
                    if (e[this.idField] == newVal) {
                        this.index = i
                        break
                    }
                }
                // this.isCalledAtMount=false
            }
        }
    },
}
</script>

<style scoped>
@import url(./combobox.css);
</style>


