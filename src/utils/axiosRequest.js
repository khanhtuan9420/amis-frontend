import axios from "axios"
import helper from "@/js/MISAHelper"
import { config } from "@/main";
const axiosRequest = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
})

/**
 * Interceptor xử lý error
 * Created by: dktuan (30/08/2023)
 */
axiosRequest.interceptors.response.use(
    (response) => response, // Trường hợp thành công, trả về response nguyên vẹn
    (error) => {
        if (error.response) {
            // Xử lý lỗi từ phản hồi HTTP (ví dụ: 404, 500, ...)
            const errorCode = error.response.data.ErrorCode
            if(!error.response.data.Errors) {
                switch (error.response.status) {
                    case 400:
                        error.response.data.Errors= ["Lỗi nhập liệu"]
                        break;
                    case 404:
                        error.response.data.Errors= ["Không tìm thấy tài nguyên"]
                        break;
                    case 409:
                        error.response.data.Errors= [config.$message.error[errorCode]]
                        break;
                    case 500:
                        error.response.data.Errors= ["Lỗi hệ thống"]
                        break;
                }
            }
            throw error.response.data;
            // Thực hiện các xử lý tùy theo mã lỗi và dữ liệu phản hồi

        } else if (error.request) {
            // Xử lý lỗi khi không có phản hồi từ máy chủ (ví dụ: không kết nối mạng)
            // console.error('Không kết nối máy chủ:', error.request);

            // Thực hiện các xử lý tùy theo trạng thái không có phản hồi
        } else {
            // Xử lý lỗi khác (ví dụ: lỗi khi tạo request)
            // console.error('Lỗi khi tạo request:', error.message);

            // Thực hiện các xử lý tùy theo loại lỗi khác
        }
        return Promise.reject(error);
    }
);

/**
* post method
* @param {String} path
* @param {Object} data
* Created by: dktuan (30/08/2023)
*/
export const postRequest = async (path, data) => {
    try {
        const res = await axiosRequest.post(path, data)
        return res.data
    } catch (error) {
        return helper.handleErrorRes(error)
    }
    
}
/**
 * get method
 * @param {String} path
 * Created by: dktuan (30/08/2023)
 */
export const getRequest = async (path) => {
    try {
        const res = await axiosRequest.get(path)
        return res.data
    } catch (error) {
        return helper.handleErrorRes(error)
    }
}

/**
 * delete method, nếu có option thì xóa nhiều, không có thì xóa một
 * @param {String} path
 * @param {Array<String>} option
 * Created by: dktuan (14/09/2023)
 */
export const deleteRequest = async (path, option) => {
    try {
        let res = null;
        if (option) {
            res = await axiosRequest.delete(path, {
                data: option
            })
        }
        else res = await axiosRequest.delete(path)
        return res.data
    } catch (error) {
        return helper.handleErrorRes(error)
    }
}

/**
 * put method
 * @param {String} path
 * @param {Object} data
 * Created by: dktuan (14/09/2023)
 */
export const putRequest = async (path, data) => {
    try {
        const res = await axiosRequest.put(path, data)
        return res.data
    } catch (error) {
        return helper.handleErrorRes(error)
    }
}

/**
 * Lấy file xuất khẩu excel
 * @param {*} path 
 * Created by: dktuan (29/09/2023)
 */
export const exportExcelRequest = async (path) => {
    try {
        const res = await axiosRequest.get(path, {
            responseType: 'arraybuffer',
            headers: {
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        })
        const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Tạo một URL tạm thời từ Blob
        const url = window.URL.createObjectURL(blob);

        // Tạo một thẻ a để tạo liên kết tải về và kích hoạt nó
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.xlsx';
        document.body.appendChild(a);
        a.click();

        // Giải phóng URL tạm thời
        window.URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        return helper.handleErrorRes(error)
    }
}

export default axiosRequest