const resource = {
    "VN": {
        toast: {
            titles: {
                SUCCESS: "Thành công",
                WARNING: "Cảnh báo",  
            },
            messages: {
                REFRESH_SUCCESS: "Làm mới thành công!",
                TOO_FAST_ACTION: "Thao tác quá nhanh!",
                ADD_SUCCESS: "Thêm mới thành công!",
                EDIT_SUCCESS: "Sửa thông tin thành công!",
                DELETE_SUCCESS: "Xóa bản ghi thành công!",
                DELETE_MANY_SUCCESS: "Xóa các bản ghi thành công!",  
                ERROR_TABLE: "Có lỗi xảy ra, không thể lấy bản ghi!",
                ACCOUNT_NUMBER_NOT_MATCH_PREFIX: "Số tài khoản không hợp lệ. Số tài khoản chi tiết phải bắt đầu bằng số của Tài khoản tổng hợp"
            },
            actions: {
                UNDO: "Hoàn tác"
            }
        },
        form: {
            titles: {
                SAVE_FORM_CONFIRM_TITLE: "Lưu nhân viên?",
                UPDATE_FORM_CONFIRM_TITLE: "Cập nhật nhân viên?"
            },
            messages: {
                SAVE_FORM_CONFIRM_MESSAGE: "Bạn có chắc chắn lưu nhân viên này không?",
                UPDATE_FORM_CONFIRM_MESSAGE: "Bạn có chắc chắn sửa thông tin nhân viên này không?"
            },
            buttons: {
                AGREE: "Đồng ý",
                CANCEL: "Hủy",
                CLOSE: "Đóng"
            },
            input: {
                required: (text) => {
                    if(!text) text= 'Dữ liệu'
                    return `${text} không được để trống`
                },
                maxLength: (text, length) => {
                    return `${text} không được vượt quá ${length} ký tự`
                },
                minLength: (text, length) => {
                    return `${text} phải có độ dài >= ${length} ký tự`
                },
                regex: (text, pattern) => {
                    return `${text} không đúng định dạng ${pattern}`
                },
                limitDate: (firstField, secondFiled, limit) => {
                    return `${firstField} phải nhỏ hơn hoặc bằng ${secondFiled} <${limit}>. Xin vui lòng kiểm tra lại.`
                },
                combobox: (field) => {
                    if(!field) return `Dữ liệu không có trong danh mục.`
                    return `Dữ liệu <${field}> không có trong danh mục.`
                }
            } 
        },
        table: {
            NO_RECORD: "Không có bản ghi nào",
            DELETE_ONE_CONFIRM: "Bạn có chắc chắn muốn xóa bản ghi này không?",
            DELETE_MANY_CONFIRM: "Bạn có chắc chắn muốn xóa các bản ghi này không?"
        },
        error: {
            "1" : (field, value) => {
                return `${field} <${value}> đã tồn tại`
            }
        }
    },
    "EN": {
        toast: {
            titles: {
                SUCCESS: "Success",
                WARNING: "Warning",  
            },
            messages: {
                REFRESH_SUCCESS: "Successfully refreshed!",
                TOO_FAST_ACTION: "Too fast action!",
                ADD_SUCCESS: "New record added successfully!",
                EDIT_SUCCESS: "Edit record successfully!",
                DELETE_SUCCESS: "Delete record successfully!",
                DELETE_MANY_SUCCESS: "Delete records successfully!", 
                ERROR_TABLE: "An error occurred, the records could not be retrieved!"
            },
            actions: {
                UNDO: "Undo"
            }
        },
        form: {
            titles: {
                SAVE_FORM_CONFIRM_TITLE: "Save this employee?",
                UPDATE_FORM_CONFIRM_TITLE: "Update this employee?"
            },
            messages: {
                SAVE_FORM_CONFIRM_MESSAGE: "Are you sure to save this employee?",
                UPDATE_FORM_CONFIRM_MESSAGE: "Are you sure to update this employee information?"
            },
            buttons: {
                AGREE: "OK",
                CANCEL: "Cancel",
            }
        },
        table: {
            NO_RECORD: "There are no records yet",
            DELETE_ONE_CONFIRM: "Are you sure you want to delete this record?",
            DELETE_MANY_CONFIRM: "Are you sure you want to delete these records?"
        },
        error: {
            "1": "Employee Code already exists"
        }
    }
}

export default resource