import enums from "./MISAEnum"
import * as accountServices from '@/services/account-services'
import * as objectServices from '@/services/object-services'
/**
 * Constructor khởi tạo headers cho table
 * @param {String} title trung
 * @param {String} dataField 
 * @param {Boolean} allowedSort 
 * @param {Boolean} allowedFilter 
 * @param {Object} dataType 
 * @param {Number} columnType 
 * @param {Boolean} editable 
 * Created by: dktuan (24/10/2023)
 */
function Headers(title, dataField, allowedSort, allowedFilter, dataType, columnType, editable, option) {
    this.title = title;
    this.dataField = dataField;
    this.allowedSort = allowedSort;
    this.allowedFilter = allowedFilter;
    this.dataType = dataType;
    this.columnType = columnType;
    this.editable = editable;
    this.option = option;
}

export const accountColumn = [
    new Headers('Số tài khoản', 'AccountNumber', true, false, String, enums.ColumnType.TREE, false),
    new Headers('Tên tài khoản', 'AccountName', true, false, String, enums.ColumnType.INPUT_TEXT, true),
    new Headers('Tính chất', 'NatureText', true, false, String, enums.ColumnType.INPUT_TEXT, true),
    new Headers('Tên tiếng Anh', 'AccountEnglishName', true, false, String, enums.ColumnType.INPUT_TEXT, false),
    new Headers('Diễn giải', 'Explain', true, false, String, enums.ColumnType.INPUT_TEXT, false),
    new Headers('Trạng thái', 'ActiveText', true, false, String, enums.ColumnType.INPUT_TEXT, false),
    new Headers('Chức năng', null, null, null,null, enums.ColumnType.CONTEXT_MENU_1, null)
];

export const paymentColumn = [
    new Headers(null, null, null, null, null, enums.ColumnType.CHECKBOX, null),
    new Headers('Ngày hạch toán', 'PaymentDate', true, false, Date, enums.ColumnType.TEXT, false),
    new Headers('Ngày chứng từ', 'RecordDate', true, false, Date, enums.ColumnType.TEXT, false),
    new Headers('Số chứng từ', 'PaymentNo', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Diễn giải', 'Explain', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Số tiền', 'Total', true, false, Number, enums.ColumnType.TEXT, false),
    new Headers('Mã đối tượng', 'SupplierCode', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Đối tượng', 'SupplierContactName', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Địa chỉ', 'Address', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Chức năng', null, null, null,null, enums.ColumnType.CONTEXT_MENU_2, null)
];

export const generalAccountColumn = [
    new Headers('Số tài khoản', 'AccountNumber', true, false, String, enums.ColumnType.TREE, false),
    new Headers('Tên tài khoản', 'AccountName', true, false, String, enums.ColumnType.INPUT_TEXT, true),
]

export const objectColumn = [
    new Headers('Đối tượng', 'SupplierCode', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Tên đối tượng', 'SupplierName', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Mã số thuế', 'TaxCode', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Địa chỉ', 'Address', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Điện thoại', 'PhoneNumber', true, false, String, enums.ColumnType.TEXT, false),
]

export const paymentDetailColumn = [
    new Headers(null, null, null, null, null, enums.ColumnType.INDEX, null),
    new Headers('Diễn giải', 'Explain', false, false, String, enums.ColumnType.INPUT_TEXT, true),
    new Headers('TK nợ', 'DebitAccountNumber', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true, {
        headers: generalAccountColumn,
        getData: async (filter, pageSize, pageNum) => {
            const res = accountServices.getAccountFilter(true, filter, pageSize, pageNum)
            return res;
        },
        idField: 'AccountId',
        valueField: 'AccountNumber',
        bindIdField: 'DebitAccountId',
        isRequired: true,
    }),
    new Headers('TK có', 'CreditAccountNumber', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true, {
        headers: generalAccountColumn,
        getData: async () => {
            const res = accountServices.getAccountFilter(true, null, null, null)
            return res;
        },
        idField: 'AccountId',
        valueField: 'AccountNumber',
        bindIdField: 'CreditAccountId',
        isRequired: true,
    }),
    new Headers('Số tiền', 'Amount', false, false, Number, enums.ColumnType.INPUT_TEXT, true, {
        total: true
    }),
    new Headers('Đối tượng', 'SupplierCode', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true, {
        headers: objectColumn,
        getData: async () => {
            const res = await objectServices.getObjects(null, null, null)
            return res;
        },
        forceDelete: true,
        idField: 'SupplierId',
        valueField: 'SupplierCode',
        bindIdField: 'SupplierId',
        bindToAnotherField: ['SupplierName']
    }),
    new Headers('Tên đối tượng', 'SupplierName', false, false, String, enums.ColumnType.TEXT, false),
    new Headers(null, null, null, null, null, enums.ColumnType.CONTEXT_MENU_3, null )
]

export const paymentDetailColumnViewOnly = [
    new Headers(null, null, null, null, null, enums.ColumnType.INDEX, null),
    new Headers('Diễn giải', 'Explain', false, false, String, enums.ColumnType.INPUT_TEXT, true),
    new Headers('TK nợ', 'DebitAccountNumber', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true),
    new Headers('TK có', 'CreditAccountNumber', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true),
    new Headers('Số tiền', 'Amount', false, false, Number, enums.ColumnType.INPUT_TEXT, true),
    new Headers('Đối tượng', 'SupplierCode', false, false, String, enums.ColumnType.COMBOBOX_TABLE, true),
    new Headers('Tên đối tượng', 'SupplierName', false, false, String, enums.ColumnType.TEXT, false),
]

export const employeeColumn = [
    new Headers('Mã nhân viên', 'EmployeeCode', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Tên nhân viên', 'EmployeeName', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('Đơn vị', 'Department', true, false, String, enums.ColumnType.TEXT, false),
    new Headers('ĐT di động', 'PhoneNumber', true, false, String, enums.ColumnType.TEXT, false),
]

export const accountProperties = [
    {
        text: 'Dư nợ',
        value: 1
    },
    {
        text: 'Dư có',
        value: 2,
    },
    {
        text: 'Lưỡng tính',
        value: 3,
    },
    {
        text: 'Không có số dư',
        value: 4,
    }
]

export const objectEntities = [
    {
        text: 'Nhà cung cấp',
        value: 0
    },
    {
        text: 'Khách hàng',
        value: 1,
    },
    {
        text: 'Nhân viên',
        value: 2,
    },
]

export const followOptions = [
    {
        text: 'Chỉ cảnh báo',
        value: 1
    },
    {
        text: 'Bắt buộc nhập',
        value: 2,
    },
]