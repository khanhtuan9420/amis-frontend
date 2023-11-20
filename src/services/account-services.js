import * as axiosRequest from "@/utils/axiosRequest";
/**
 * Lấy các bản ghi theo phân trang và keyword, nếu pageSize và pageNum là null thì lấy hết bản ghi theo keyword
 * @param {*} expand 
 * @param {*} filter 
 * @param {*} pageSize 
 * @param {*} pageNum 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const getAccountFilter = async (expand, filter, pageSize, pageNum, id) => {
    let route = `/Account?expand=${expand}`
    if(pageNum && pageSize) {
        route+= `&pageSize=${pageSize}&page=${pageNum}`
    }
    if(filter!=null) route += `&searchString=${filter}`;
    if(id) route += `&id=${id}`;
    const res = await axiosRequest.getRequest(route);
    return res;
}

/**
 * Lấy các bản ghi con theo id của bản ghi cha và keyword
 * @param {*} filter 
 * @param {*} id 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const getChildren = async (filter, id) => {
    let route = `/Account/${id}/children`;
    if(filter!=null) route += `&searchString=${filter}`;
    const res = await axiosRequest.getRequest(route)
    return res;
}

/**
 * Tạo 1 tài khoản mới
 * @param {*} formData 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const createAccount = async (formData) => {
    const res = await axiosRequest.postRequest('/Account', formData)
    return res
}

/**
 * Sửa 1 tài khoản
 * @param {*} id 
 * @param {*} formData 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const updateAccount = async (id, formData) => {
    const res = await axiosRequest.putRequest(`/Account/${id}`, formData)
    return res
}

export const deleteAcount = async (id) => {
    const res = await axiosRequest.deleteRequest(`/Account/${id}`)
    return res
}

export const updateActiveStatus = async (id, val, forceChild) => {
    const res = await axiosRequest.putRequest('/Account/updateActive', {
        Id: id,
        Value: val,
        ForceChild: forceChild
    })
    return res
}