import { createApp } from 'vue'
import App from './App.vue'
import MISAButton from './components/base/button/MISAButton.vue';
import MISAToast from './components/base/toast/MISAToast.vue';
import MISATable from './components/base/table/MISATable.vue';
import MISADialog from './components/base/dialog/MISADialog.vue';
import MISAInput from './components/base/input/MISAInput.vue'
import MISAModal from './components/base/modal/MISAModal.vue';
import MISALoading from './components/base/loading/MISALoading.vue'
import MISACombobox from './components/base/combobox/MISACombobox.vue'
import enums from './js/MISAEnum';
import resource from './js/MISAResource';
import router from './routes/routes';
import emitter from 'tiny-emitter/instance'
import helper from './js/MISAHelper';
import vuetify from './plugins/vuetify';
import MISAForm from './components/base/form/MISAForm.vue'
import MISADateInput from './components/base/date-input/MISADateInput.vue'
import MISATextArea from './components/base/textarea/MISATextArea.vue'
import MISACheckbox from './components/base/input/MISACheckbox.vue'
import MISAComboboxWithCheckbox from './components/base/combobox/MISAComboboxWithCheckbox.vue'
import MISAAccordion from './components/base/accordion/MISAAccordion.vue'
import MISATableTree from './components/base/table/MISATableTree.vue'
import MISATableRow from './components/base/table/MISATableRow.vue'
import MISACell from './components/base/table/MISACell.vue'
import MISAComboboxTable from './components/base/combobox/MISAComboboxTable.vue'
import VueTippy from 'vue-tippy';

var app = createApp(App)
app.component('m-button', MISAButton)
app.component('m-toast', MISAToast)
app.component('m-table', MISATable)
app.component('m-dialog', MISADialog)
app.component('m-input', MISAInput)
app.component('m-modal', MISAModal)
app.component('m-loading', MISALoading)
app.component('m-combobox', MISACombobox)
app.component('m-form', MISAForm)
app.component('m-date-input', MISADateInput)
app.component('m-textarea', MISATextArea)
app.component('m-checkbox', MISACheckbox)
app.component('m-combobox-checkbox', MISAComboboxWithCheckbox)
app.component('m-accordion', MISAAccordion)
app.component('m-table-tree', MISATableTree)
app.component('m-table-row', MISATableRow)
app.component('m-tabel-cell', MISACell)
app.component('m-combobox-table', MISAComboboxTable)

const config = app.config.globalProperties
config.$enum = enums
config.$helper=helper
config.$lang = "VN"
config.$message = resource[config.$lang]
config.$emitter = emitter
config.$format = JSON.parse(localStorage.getItem('config'))

app.use(router)
app.use(vuetify)
app.use(VueTippy);

app.mount('#app')

export {config}
export default app