import * as axiosRequest from "@/utils/axiosRequest";

export const getPaymentById = async (id) => {
    let route = `/Payment/${id}`;
    const res = await axiosRequest.getRequest(route);
    return res;
}

export const getPayments = async (filter, pageSize, pageNum) => {
    let route = `/Payment?pageSize=${pageSize}&page=${pageNum}`
    if(filter!=null) route += `&searchString=${filter}`;
    const res = await axiosRequest.getRequest(route);
    return res;
}

export const getDetails = async (id, filter, pageSize, pageNum) => {
    let route = `/Payment/${id}/details`
    if(pageSize && pageNum) route += `?pageSize=${pageSize}&pageNum=${pageNum}`;
    if(filter!=null) route += `&filter=${filter}`;
    const res = await axiosRequest.getRequest(route);
    return res;
}

export const getNewCode = async () => {
    const res = await axiosRequest.getRequest('/Payment/NewCode')
    return res
}

export const createPayment = async (master, details) => {
    const res = await axiosRequest.postRequest('/Payment/CreateMasterDetail', {
        Payment: master,
        Details: details
    })
    return res;
}

export const updatePayment = async (data) => {
    const res = await axiosRequest.putRequest('/Payment/UpdateMasterDetail', data)
    return res
}

export const deleteRecords = async (data) => {
    const res = await axiosRequest.deleteRequest('/Payment/DeleteMasterDetail', data)
    return res
}

export const exportExcel = async (searchString) => {
    let route = `/Payment/export`
    if(searchString) route += `?search=${searchString}`
    const res = await axiosRequest.exportExcelRequest(route);
    return res;
}