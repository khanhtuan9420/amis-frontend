const nature = {
    1: 'Dư nợ',
    2: 'Dư có',
    3: 'Lưỡng tính',
    4: 'Không có số dư'
}
// const follow = {
//     1: 'Chỉ cảnh báo',
//     2: 'Bắt buộc nhập'
// }
/**
 * Map nhiều bản ghi từ dữ liệu số sang text
 * @param {*} data 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const mapperMany = (data = []) => {
    return data.map(e => {
        return {
            ...e,
            NatureText: nature[e.Nature],
            ActiveText: e.Active ? 'Đang sử dụng' : 'Ngừng sử dụng'
        }
    })
}

/**
 * Map 1 bản ghi từ dữ liệu số sang text
 * @param {*} data 
 * @returns 
 * Created by: dktuan (01/11/2023)
 */
export const mapper = (data) => {
    return {
        ...data,
        NatureText: nature[data.Nature],
        ActiveText: data.Active ? 'Đang sử dụng' : 'Ngừng sử dụng'
    }
}