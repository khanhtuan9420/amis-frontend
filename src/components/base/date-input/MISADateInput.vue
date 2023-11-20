<template>
  <div class="label">
    <label v-if="label" :title="labelTitle" class="label-name" for="">{{ label }}</label>
    <div v-if="isRequired" class="required">*</div>
  </div>
  <div @keydown.tab="handleTab" class="date-input-container">
    <div class="date-input">
      <div class="input-container" v-for="(field, index) in formatFields" :key="field">
        <input v-model="dateParts[field]" type="text" :placeholder="field" @blur="handleBlur(field)"
          @input="handleInput(field, getMax(field), field === 'yyyy' ? 4 : 2)" :class="{
            [field]: true,
            'extendWidth': field == 'mm' && extendWidth
          }" :ref="field + 'Input'" />
        <span :class="'separate-' + index">/</span>
      </div>
    </div>
    <input tabindex="-1" class="pure-input" @input="bindingValue" type="date">
  </div>
</template>

<script>
import { config } from '@/main';
export default {
  props: {
    label: String,
    labelTitle: String,
    isRequired: Boolean,
    format: String,
    modelValue: null,
  },
  data() {
    return {
      dateParts: {
        yyyy: '',
        mm: '',
        dd: '',
      },
      extendWidth: true,
    };
  },
  computed: {
    formatFields() {
      // Xác định thứ tự hiển thị của các ô input dựa trên định dạng
      switch (config.$format.DateFormat) {
        case 'dd/mm/yyyy':
          return ['dd', 'mm', 'yyyy'];
        case 'mm/dd/yyyy':
          return ['mm', 'dd', 'yyyy'];
        case 'yyyy/mm/dd':
        default:
          return ['yyyy', 'mm', 'dd'];
      }
    },

  },
  methods: {
    handleInput(field, max, maxLength) {
      // Kiểm tra giới hạn độ dài và giá trị nhập vào
      if (this.dateParts[field].length > maxLength) {
        this.dateParts[field] = this.dateParts[field].slice(0, maxLength);
      }
      if (field == 'mm') {
        if (this.dateParts['mm']) this.extendWidth = false
        else this.extendWidth = true
      }

      // Kiểm tra giới hạn giá trị của tháng và ngày
      const value = parseInt(this.dateParts[field]);
      if (!isNaN(value) && value > max) {
        this.dateParts[field] = max.toString();
      }

      // Di chuyển tới ô input tiếp theo khi độ dài đạt giới hạn
      if (this.dateParts[field].length >= maxLength) {
        const currentIndex = this.formatFields.indexOf(field);
        if (currentIndex < this.formatFields.length - 1) {
          const nextField = this.formatFields[currentIndex + 1];
          this.$refs[nextField + 'Input'][0].focus();
        }
      }
      if (this.dateParts.yyyy && this.dateParts.mm && this.dateParts.dd) {
        const date = this.dateParts.yyyy + "-" + this.dateParts.mm + "-" + this.dateParts.dd;
        this.$emit('update:modelValue', date)
      } else this.$emit('update:modelValue', null)
    },
    getMax(field) {
      // Xác định giá trị max cho tháng và ngày dựa trên định dạng
      switch (field) {
        case 'mm':
          return 12;
        case 'dd':
          return 31;
        default:
          return 9999; // Giá trị max cho năm
      }
    },
    bindingValue(e) {
      let arr = e.target.value.split('-');
      this.dateParts.yyyy = arr[0]
      this.dateParts.mm = arr[1]
      this.dateParts.dd = arr[2]
      this.extendWidth = false
      this.$emit('update:modelValue', e.target.value)
    },
    handleBlur(field) {
      if (!this.dateParts[field]) return
      if (field != 'yyyy') {
        this.dateParts[field] = this.dateParts[field].padStart(2, '0');
      }
      else this.dateParts[field] = this.dateParts[field].padStart(4, '0');
    }
  },
  created() {
    if (this.modelValue) {
      let arr = this.modelValue.split('/');
      if (config.$format.DateFormat == 'yyyy/mm/dd') {
        this.dateParts.yyyy = arr[0]
        this.dateParts.mm = arr[1]
        this.dateParts.dd = arr[2]
      }
      else {
        this.dateParts.yyyy = arr[2]
        this.dateParts.mm = arr[1]
        this.dateParts.dd = arr[0]
      }
      const date = this.dateParts.yyyy + "-" + this.dateParts.mm + "-" + this.dateParts.dd;
      this.$emit('update:modelValue', date)
      this.extendWidth = false
    }
  },
  watch: {
    modelValue(newVal) {
      if(newVal==null) this.dateParts= {
        yyyy: '',
        mm: '',
        dd: '',
      }
    }
  },
};
</script>



<style scoped>
@import url(./date-input.css);
</style>
