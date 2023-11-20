<template>
    <td :class="{
        'cell': true,
        'check-col': headers[i].columnType === config.$enum.ColumnType.CHECKBOX,
        'index-cell': headers[i].columnType === config.$enum.ColumnType.INDEX,
        'edit-btn': headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_1 ||
            headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_2,
        // headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_3,
        'bold': value.IsParent
    }">
        <input @click="handleCheck" class="checkbox" ref="check" type="checkbox" name="check-all"
            v-if="headers[i].columnType === config.$enum.ColumnType.CHECKBOX">
        <div v-if="headers[i].columnType === config.$enum.ColumnType.TREE" :class="{ 'tree-first-col': i == 0 }">
            <m-button :style="{ marginLeft: i == 0 ? (value.Grade - 1) * 24 + 'px' : null }" @click="toggleChildren"
                :icon="isExpanded ? 'minus-icon' : 'plus-icon'" variant="whitebg" class="expand-btn"
                v-if="i == 0 && value.IsParent && !isAlwaysExpand"></m-button>
            <span v-if="mode != config.$enum.TableMode.EDIT || !headers[i].editable"
                :style="{ marginLeft: value.Grade * 24 + 'px' }" :class="'tree-column'">
                {{
                    formatData(value[headers[i].dataField],
                        headers[i].dataType)
                }}
            </span>
        </div>
        <span v-if="headers[i].columnType === config.$enum.ColumnType.INDEX">{{ index + 1 }}</span>
        <div class="submenu-container blue-color" v-if="headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_1">
            <m-button @click="editRecord" variant="whitebg" class="edit-button">Sửa</m-button>
            <m-button :id="'context-menu' + this.id" :outline="true" :index="index" class="context-menu-btn"
                icon="arrow-down-icon"></m-button>
            <v-menu transition="slide-y-transition">
                <template #activator="{ props }">
                    <label class="lb-context-menu" :for="'context-menu' + this.id" v-bind="props"></label>
                </template>
                <v-list>
                    <v-list-item>
                        <v-list-item-title @click="handleReplicate(index)">Nhân bản</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="handleDelete(index)">Xóa</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="toggleActive">{{ value.Active ? "Ngừng sử dụng" : "Sử dụng"
                        }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div class="submenu-container blue-color" v-if="headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_2">
            <m-button @click="viewRecord" variant="whitebg" class="edit-button">Xem</m-button>
            <m-button :id="'context-menu' + id" :outline="true" :index="index" class="context-menu-btn"
                icon="arrow-down-icon"></m-button>
            <v-menu transition="slide-y-transition">
                <template #activator="{ props }">
                    <label class="lb-context-menu" :for="'context-menu' + id" v-bind="props"></label>
                </template>
                <v-list>
                    <v-list-item>
                        <v-list-item-title>Ghi sổ</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="handleDelete(index)">Xóa</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title @click="handleReplicate(index)">Nhân bản</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div @click="console.log(value)" class="submenu-container blue-color"
            v-if="headers[i].columnType === config.$enum.ColumnType.CONTEXT_MENU_3">
            <span @click="removeRow">Xóa</span>
        </div>
        <div :class="{
            'tree-first-col': i == 0,
            'align-right': headers[i].dataType === Number,
            'align-center': headers[i].dataType === Date,
            'align-left': headers[i].dataType === String
        }"
            v-if="[config.$enum.ColumnType.CHECKBOX, config.$enum.ColumnType.TREE,
            config.$enum.ColumnType.INDEX, config.$enum.ColumnType.CONTEXT_MENU].indexOf(headers[i].columnType) === -1">
            <span v-if="mode != config.$enum.TableMode.EDIT || !headers[i].editable">
                {{
                    formatData(value[headers[i].dataField],
                        headers[i].dataType)
                }}
            </span>
            <m-input @inputChange="inputChange" :formatType="inputType" :bindRef="true"
                v-model="cloneValue[headers[i].dataField]" v-if="headers[i].columnType === config.$enum.ColumnType.INPUT_TEXT && headers[i].editable &&
                        mode === config.$enum.TableMode.EDIT"></m-input>
            <m-combobox-table @inputChange="inputChange" :inCell="true" @getData="getData" :isGetAll="true"
                v-model="cloneValue[headers[i].option.bindIdField ? headers[i].option.bindIdField : headers[i].option.idField]"
                :idField="headers[i].option.idField" :valueField="headers[i].option.valueField" ref="hehe"
                :column="headers[i].option.headers" :items="items" v-if="headers[i].columnType === config.$enum.ColumnType.COMBOBOX_TABLE && headers[i].editable &&
                    mode === config.$enum.TableMode.EDIT" :label="headers[i].title"
                :isRequired="headers[i].option.isRequired" :showRequired="false"
                :bindToAnotherField="headers[i]?.option?.bindToAnotherField"></m-combobox-table>
        </div>
    </td>
</template>

<script>
import { config } from '@/main';
import helper from '@/js/MISAHelper'
export default {
    emits: ["handleDelete"],
    props: ['value', 'i', 'id', 'isExpanded', 'mode', 'isCheckAll', 'headers', 'index', 'tableType', 'isAlwaysExpand', 'idField', 'isCheckAllBtnClicked'],
    data() {
        return {
            config: config,
            cloneValue: { ...this.value },
            refValue: this.value,
            items: [],
            inputType: 'text',
        }
    },
    methods: {
        /**
         * emit sự kiện thu gọn, mở rộng đối với bảng dạng tree
         * Created by: dktuan (24/10/2023)
         */
        toggleChildren() {
            this.$emit('toggleChildren', this.value)
        },
        /**
         * Format dữ liệu của từng cell
         * @param {*} data
         * @param {*} type  
         * Created by: dktuan (24/10/2023)
         */
        formatData(data, type) {
            return helper.formatCell(data, type)
        },/**
         * Emit sự kiện sửa 1 bản ghi
         * created by: dktuan (07/11/2023)
         */
        editRecord() {
            this.$emitter.emit('editRecord', this.value)
        },
        handleReplicate() {
            let cloneValue = { ...this.value }
            cloneValue[this.idField] = undefined
            this.$emitter.emit('replicateRecord', cloneValue, this.value)
        },
        handleDelete() {
            this.$emit('handleDelete', this.value)
        },
        toggleActive() {
            this.$emitter.emit('toggleActive', this.value)
        },
        handleCheck() {
            this.$emitter.emit('checkRecord', this.value)
        },
        viewRecord(e) {
            e.stopPropagation();
            this.$emitter.emit('viewRecord', this.value)
        },
        removeRow() {
            this.$emitter.emit('removeRow', this.value)
        },
        inputChange(val, another) {
            console.log('bvc')
            const field = this.headers[this.i].option?.bindIdField ? this.headers[this.i].option.bindIdField : this.headers[this.i].dataField
            if (another && this.headers[this.i].option?.bindToAnotherField) {
                for (const e of another) {
                    this.cloneValue[e.key] = e.value
                    this.refValue[e.key] = e.value
                }
            }
            console.log(val, field)
            this.cloneValue[field] = val
            this.refValue[field] = val
            if (this.headers[this.i]?.option?.total) {
                this.$emitter.emit('changeTotal')
            }
        },
        async getData() {
            const res = await this.headers[this.i].option.getData()
            this.items = res.Data
        },
        resetSelected() {
            setTimeout(() => {
                if(this.$refs.hehe) {
                    this.$refs.hehe.selectedItem=null
                    this.$refs.hehe.error=false
                }
            },1)
        }
    },
    async mounted() {
        if (this.headers[this.i].columnType === config.$enum.ColumnType.COMBOBOX_TABLE && this.headers[this.i].editable &&
            this.mode === config.$enum.TableMode.EDIT) {
            await this.getData()
            if(this.headers[this.i]?.option.forceDelete) {
                this.$emitter.on('resetSelected', this.resetSelected)
            }
        }
        if (this.headers[this.i].dataType == Number) this.inputType = 'number'
    },
    unmounted() {
        if (this.headers[this.i].columnType === config.$enum.ColumnType.COMBOBOX_TABLE && this.headers[this.i].editable &&
            this.mode === config.$enum.TableMode.EDIT) {
            if(this.headers[this.i]?.option.forceDelete) {
                this.$emitter.on('resetSelected', this.resetSelected)
            }
        }
    },
    watch: {
        value: {
            handler: function (newVal) {
                this.cloneValue = { ...newVal }
                // if(this.headers[this.i].option && this.headers[this.i].title=="Đối tượng") {
                //     if(this.cloneValue[this.headers[this.i].option.bindIdField] == null) {
                //         setTimeout(()=> {
                //             this.$refs.hehe.selectedItem = null

                //         },50)
                //     }
                // }
            },
            deep: true
        },
        async mode(newVal) {
            if (this.headers[this.i].columnType === config.$enum.ColumnType.COMBOBOX_TABLE && this.headers[this.i].editable &&
                newVal === config.$enum.TableMode.EDIT) {
                await this.getData()
            }
        },
        isCheckAll(newVal) {
            if (this.headers[this.i].columnType === config.$enum.ColumnType.CHECKBOX) {
                if (newVal) {
                    this.$refs.check.checked = true
                } else if (this.isCheckAllBtnClicked) {
                    this.$refs.check.checked = false
                }
            }
        }
    },
}
</script>

<style>
@import url(./table.css);
</style>