import * as axiosRequest from "@/utils/axiosRequest";

export const getPaymentDetails = async () => {
    let route = `/PaymentDetail`
    const res = await axiosRequest.getRequest(route);
    return res;
}