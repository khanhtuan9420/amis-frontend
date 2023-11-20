import * as axiosRequest from "@/utils/axiosRequest";

/**
 * Lấy mã nhân viên mới
 * Created by: dktuan (30/08/2023)
 */
export const getNewCode = async () => {
    const res = await axiosRequest.getRequest('/Employee/new-code');
    return res;
}

/**
 * thêm nhân viên mới
 * @param {Object} data
 * Created by: dktuan (30/08/2023)
 */
export const addEmployees = async (data) => {
    const res = await axiosRequest.postRequest('/Employee', data)
    return res;
}

/**
 *  * lấy danh sách nhân viên
 * @param {Number} size 
 * @param {Number} page 
 * @param {String} key 
 * Created by: dktuan (30/08/2023)
 */
export const getEmployees = async (size, page, key, id) => {
    let route = `/Employee`;
    if(page && size) {
        route += `&pageSize=${size}&page=${page}`
    }
    if(key!=null) route += `&searchString=${key}`;
    if(id) route += `&id=${id}`;
    let index = route.indexOf('&')
    if(index>0) route = route.substring(0, index) + '?' + route.substring(index + 1);
    const res = await axiosRequest.getRequest(route);
    return res;
}

/**
 * xóa nhân viên
 * @param {String} id
 * Created by: dktuan (14/09/2023)
 */
export const deleteEmployee = async (id) => {
    const res = await axiosRequest.deleteRequest(`/Employee/${id}`)
    return res;
}

/**
 * Xóa nhiều nhân viên
 * @param {Array} ids 
 * Created by: dktuan (21/09/2023)
 */
export const deleteManyEmployees = async (ids) => {
    const res = await axiosRequest.deleteRequest('/Employee', ids)
    return res;
}

/**
 * sửa thông tin nhân viên
 * @param {String} id
 * @param {Object} data
 * Created by: dktuan (14/09/2023)
 */
export const updateEmployee = async (id, data) => {
    const res = await axiosRequest.putRequest(`/Employee/${id}`, data)
    return res;
}

/**
 * Lấy file xuất khẩu excel
 * @param {*} searchString 
 * Created by: dktuan (28/09/2023) 
 */
export const exportExcel = async (searchString) => {
    const res = await axiosRequest.exportExcelRequest(`/Employee/export?searchString=${searchString}`);
    return res;
}