<template>
    <!-- <tr @dblclick="editRecord(index)"> -->
    <tr ref="row" @click="handleSelectRow" :class="{ 'highlight-row': selectedId === row[valueField] && selectedId }">
        <m-tabel-cell @handleDelete="handleDelete" :isCheckAll="isCheckAll" :isAlwaysExpand="isAlwaysExpand" 
        :tableType="tableType" v-for="(td, i) in headers" :key="td" :id="id"
        :i="i" :value="row" :headers="headers" :idField="IdField" :isCheckAllBtnClicked="isCheckAllBtnClicked"
            @toggleChildren="toggleChildren" :isExpanded="isExpanded" :mode="mode" :index="index"></m-tabel-cell>
        <!-- <td class="blue-color edit-btn">
            
        </td> -->
    </tr>
    <template v-if="isExpanded || isAlwaysExpand">
        <m-table-row :IdField="IdField" :isAlwaysExpand="isAlwaysExpand" @selectRow="childRowSelect"
        @toggleChildren="toggleChildren" :selectedId="selectedId" :tableType="tableType"
            v-for="child in row.Children" :headers="headers" :row="child" :mode="mode" :key="child" :valueField="valueField"></m-table-row>
    </template>
</template>

<script>
import enums from '@/js/MISAEnum'
import { v4 as uuidv4 } from 'uuid'

export default {
    props: ['row','isCheckAll', 'headers', 'mode', 'index', 'tableType', 'selectedId', 'IdField', 'valueField', 'isAlwaysExpand'
        ,'isCheckAllBtnClicked'],
    emits: ['toggleChildren', 'selectRow', 'handleDelete'],
    data() {
        return {
            isExpanded: false,
            isParent: this.row.isParent,
            children: [],
            myEnums: enums,
            id: uuidv4()
        }
    },
    methods: {
        handleDelete(val) {
            this.$emit('handleDelete', val)
        },
        childRowSelect(val) {
            this.$emit('selectRow', val)
        },
        /**
         * thu gọn, mở rộng đối với bảng dạng tree
         * Created by: dktuan (24/10/2023)
         */
        toggleChildren(value = this.row) {
            console.log(value, this.isExpanded)
            if (this.row[this.valueField] === value[this.valueField]) {
                if (!this.isExpanded) {
                    this.isExpanded = true
                } else this.isExpanded = false
            }
        },
        /**
         * emit sự kiện chọn 1 bản ghi khi click
         * Created by: dktuan (07/11/2023
         */
        handleSelectRow() {
            this.$emit('selectRow', this.row)
        }
    },
    mounted() {
        if (this.selectedId === this.row[this.valueField]) {
            this.$refs.row.scrollIntoView({
                block: "center",
                behavior: "smooth",
            });
        }
        if(this.tableType === this.myEnums.TableType.TREE) this.isExpanded=false
            else if(this.tableType === this.myEnums.TableType.TREE_EXPANDED) this.isExpanded=true
    },
    watch: {
        
        /**
         * Scroll row được chọn vào vùng hiển thị
         * @param {*} newVal 
         * Created by: dktuan (07/11/2023)
         */
        selectedId(newVal) {
            if (newVal === this.row[this.valueField]) {
                this.$refs.row.scrollIntoView({
                    behavior: "smooth",
                    block: 'center', inline: 'nearest'
                });
            }
        },
        tableType(newVal) {
            if(newVal === this.myEnums.TableType.TREE) this.isExpanded=false
            else if(newVal === this.myEnums.TableType.TREE_EXPANDED) this.isExpanded=true
        }
    },
}
</script>

<style>
@import url(./table.css);
</style>