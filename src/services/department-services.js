import * as axiosRequest from "@/utils/axiosRequest";

/**
 * lấy danh sách đơn vị
 * Created by: dktuan (30/08/2023)
 */
export const getDepartments = async () => {
    const {Data} = await axiosRequest.getRequest('/Department')
    const x=[]
    Data.forEach(element => {
        let newElement =  {
            "text": element.DepartmentName,
            "value": element.DepartmentId
        }
        x.push(newElement)
        
    });
    return x;
}