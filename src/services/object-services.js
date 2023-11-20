import * as axiosRequest from "@/utils/axiosRequest";

export const getObjects = async (filter, pageSize, pageNum, id) => {
    let route = `/Supplier`
    if(pageSize && pageNum) route +=`&pageSize=${pageSize}&page=${pageNum}`
    if(filter!=null) route += `&searchString=${filter}`;
    if(id) route += `&id=${id}`;
    let index = route.indexOf('&')
    if(index>0) route = route.substring(0, index) + '?' + route.substring(index + 1);
    const res = await axiosRequest.getRequest(route);
    return res;
}