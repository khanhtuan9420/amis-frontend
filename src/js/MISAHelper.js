import { config } from "@/main";
const helper = {
    /**
     * Cập nhật lại giá trị của bản ghi sau khi sửa vào table
     * @param {*} origin 
     * @param {*} des 
     * Created by: dktuan (08/11/2023)
     */
    mapRowEdit: (origin, des) => {
        for (const prop in des) {
            if (Object.prototype.hasOwnProperty.call(des, prop)) {
                origin[prop] = des[prop];
            }
        }
    },
    /**
     * Chuyển dữ liệu dạng phẳng sang dạng cây
     * @param {*} input 
     * @param {*} valueField 
     * Created by: dktuan (08/11/2023) 
     */
    transformData: (input, valueField) => {
        const output = [];
        const map = {};
        input.forEach((item) => {
            const newItem = { ...item, Children: [] };
            map[item[valueField]] = newItem;

            if (item.Grade > 1) {
                const parent = item[valueField].slice(0, -1);
                if (map[parent]) {
                    map[parent].Children.push(newItem);
                } else {
                    output.push(newItem)
                }
            } else {
                output.push(newItem);
            }
        });
        // console.log(output)
        return output;
    },
    /**
     * format dữ liệu của từng ô trong table
     * @param {*} data 
     * @param {*} type 
     * @returns 
     */
    formatCell: (data, type) => {
        if (data == null || data == undefined) return
        if (type === Number) {
            const formattedNumber = data.toString().replace(/^0+(?=\d)/, '');

            // Định dạng số theo ý bạn (ví dụ: 1.200.000)
            return parseInt(formattedNumber, 10).toLocaleString();
        }
        else if (type === Date) {
            data = data.substring(0, 10).split('-')
            data.reverse()
            return data.join('/')
        }
        return data
    },
    /**
     * format ngày tháng năm dựa trên các cột được truyền vào
     * @param {Array} list 
     * @param  {...String} columns 
     * Created by: dktuan (30/08/2023)
     */
    formatDate: (val) => {
        val = val.substring(0, 10).split('-')
        val.reverse()
        return val.join('/')
    },
    /**
     * Đảo ngược định dạng  sang yyyy/mm/dd
     * @param {Object} data 
     * @param  {...String} columns 
     * Created by: dktuan (30/08/2023)
     */
    reverseDate: (data, ...columns) => {
        let newElement = data
        for (let column of columns) {
            if (data[column] != null) {
                let arrDate = data[column].split('/');
                arrDate.reverse()
                newElement = { ...newElement, [column]: arrDate.join('-') }
            }
        }
        return newElement
    },
    /**
     * xử lý lỗi khi gửi request
     * Created by: dktuan (30/08/2023)
     */
    handleErrorRes: (error) => {
        // const code = error.response.status;
        console.log(error)
        const title = error.UserMessage;
        const msg = error.Errors
        const dialogState = {
            type: config.$enum.ToastType.ERROR,
            error: true,
            errorCode: error.ErrorCode,
            show: true,
            msg: msg,
            title: title,
            otherData: error.OtherData
        }
        // config.$emitter.emit('openErrorDialog', dialogState);
        return dialogState;
    }
}

export default helper