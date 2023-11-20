<template>
    <div class="label">
        <label v-if="label" :title="labelTitle" class="label-name" for="">{{ label }}</label>
        <div v-if="isRequired" class="required">*</div>
    </div>
    <tippy v-tippy="{ placement: 'bottom' }" class="combobox-tippy">
        <div class="combobox-wrapper" @click="console.log(modelValue)" :class="{ error: error, 'combobox-disabled': disabled }">
            <m-loading class="first-loading" v-if="!disabled && items === null"></m-loading>
            <input :id="comboboxId" ref="input" :tabindex="disabled ? -1 : 0" @focusin="filterOptions" type="text"
                v-model="selectedItem" @input="filterOptions" @blur="clearResults" @keyup.down="highlightNext"
                @keyup.up="highlightPrevious" @keyup.enter="confirmSelection" />
            <m-button :data="comboboxId" tabindex="-1" @click="expandOptions" class="expand-icon" icon="down-arrow-icon"
                :class="{ 'flip': arrowFlip }"></m-button>
            <ul @scroll="infiniteScroll" ref="listItem" v-if="filteredOptions.length > 0" class="list-wrapper">
                <li :ref="'li' + index" v-for="(option, index) in filteredOptions" class="list-item" :key="index"
                    :class="{ highlighted: index === highlightedIndex }" @click="selectOption(index)">
                    {{ option }}
                </li>
                <li class="loading-item" v-if="isLoading">
                    <m-loading></m-loading>
                </li>
            </ul>
        </div>
        <template #content>
            <div v-if="error" class="error-message">{{ label + " " + errorMessage }}</div>
        </template>
    </tippy>
    
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
let isApiCalled = false;
export default {
    computed: {
        comboboxId() {
            return uuidv4()
        }
    },
    props: {
        label: String,
        labelTitle: String,
        isRequired: Boolean,
        items: Object,
        modelValue: null,
        disabled: {
            type: Boolean,
            default: false,
        },
        defaultIndex: null,
    },
    data() {
        return {
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
        };
    },
    methods: {
        /**
         * Hiển thị danh sách lựa chọn dựa vào input mà user nhập
         * Created by: dktuan (21/09/2023)
         */
        filterOptions() {
            console.log(this.disabled)
            if (this.disabled) return
            this.arrowFlip = true;
            this.filteredOptions = this.myItems.filter((option) => {
                if (option != null) {
                    if (this.selectedItem == null) return option
                    return option.toLowerCase().includes(this.selectedItem.toLowerCase())
                }
                else return false
            });
            this.highlightedIndex = -1;
        },
        /**
         * Ẩn danh sách lựa chọn
         * Created by: dktuan (21/09/2023)
         */
        clearResults() {
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
                this.selectedItem = this.filteredOptions[index];
                this.filteredOptions = [];
            }
        },
        /**
         * Highlight lựa chọn tiếp theo
         * Created by: dktuan (21/09/2023)
         */
        highlightNext() {
            if (this.highlightedIndex < this.filteredOptions.length - 1) {
                this.highlightedIndex++;
            }
        },
        /**
         * Highlight lựa chọn trước
         * Created by: dktuan (21/09/2023)
         */
        highlightPrevious() {
            if (this.highlightedIndex > 0) {
                this.highlightedIndex--;
            }
        },
        /**
         * Xác nhận lựa chọn khi người dùng ấn Enter
         * Created by: dktuan (21/09/2023)
         */
        confirmSelection() {
            if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length) {
                this.selectOption(this.highlightedIndex);
            }
        },
        /**
         * Validate input
         * Created by: dktuan (21/09/2023)
         */
        validate() {
            if (this.isRequired && !this.selectedItem) {
                this.error = true;
                this.errorMessage = "không được để trống"
            } else {
                this.error = false;
            }
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
            this.$refs.listItem.addEventListener('scroll', () => {
                let lastElement = this.$refs[`li${this.myItems.length - 1}`][0];
                if (lastElement.offsetTop + lastElement.clientHeight <=
                    Math.ceil(this.$refs.listItem.scrollTop + this.$refs.listItem.clientHeight)) {
                    this.isLoading = true;
                    if (!isApiCalled) {
                        isApiCalled = true;
                        setTimeout(() => {
                            const res = [...this.items] // fake call api
                            res.forEach(e => {
                                this.map[e.text] = e.value
                                this.myItems.push(e.text)
                            })
                            console.log(this.myItems.length)
                            this.filterOptions()
                            this.isLoading = false
                            isApiCalled = false;
                        }, 1000);
                    }
                }
            })
        },
        /**
         * tạo 1 map với key là giá trị text hiển thị cho người dùng, value là giá trị tương ứng với text đó
         * @param {Array} items 
         * Created by: dktuan (24/10/2023)
         */
        mapData(items) {
            items.forEach(e => {
                this.map[e.text] = e.value
                this.myItems.push(e.text)
            })
            this.isLoading = false
            items.forEach(e => {
                if (e.value == this.modelValue) this.selectedItem = e.text
            });
        }
    },
    mounted() {
        this.register();
        if (this.items) {
            this.mapData(this.items)
        }
        // Xử lý khi người dùng blur khỏi combobox
        window.addEventListener('click', (e) => {
            this.clickExpandBtn = e.target.__vnode?.props?.data === this.comboboxId ||
                e.target.__vueParentComponent?.props?.data === this.comboboxId
        })
    },
    watch: {
        /**
         * Scroll phần tử vào view khi ấn arrow key
         * Created by: dktuan (24/10/2023)
         */
        highlightedIndex(newVal) {
            if (this.$refs['li' + newVal]) {
                this.$refs['li' + newVal][0].scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                });
            }
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
            this.mapData(newVal);
        },
        /**
         * validate khi nhập liệu và binding với form
         * @param {Object} newVal 
         * Created by: dktuan (21/09/2023)
         */
        selectedItem(newVal) {
            this.validate()
            if (this.map[newVal]) this.selectedItem = newVal
            this.$emit('update:modelValue', this.map[newVal])
        },
        /**
         * map dữ liệu ở form sửa
         * @param {Object} newVal 
         * Created by: dktuan (21/09/2023)
         */
        modelValue(newVal) {
            console.log(123)
            if(!this.selectedItem) {
                for (const key in this.map) {
                    if(this.map[key]==newVal) this.selectedItem=key
                }
            }
        },
        disabled(newVal) {
            if(!newVal && this.defaultIndex != null) {
                this.selectedItem = this.myItems[this.defaultIndex];
                console.log(this.selectedItem)
            } else {
                this.selectedItem = null
            }
        } 
    },
}
</script>

<style scoped>
@import url(./combobox.css);
</style>
