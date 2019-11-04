import { LOCAL_API, GET_HISTORY_PENDING, GET_HISTORY_FAILURE, GET_HISTORY_SUCESS } from './../contant/index';
import axios from 'axios';
import { message } from 'antd';

export const getHistory = () => {
    return dispatch => {
        dispatch(GetHistoryPending());
        axios
            .get(`${LOCAL_API}/history`)
            .then(res => {
                dispatch(GetHistorySucess(res.data));
            })
            .catch(err => {
                const errInfor = err.response.data ? err.response.data : "Đã có lỗi xảy ra, vui lòng thử lại";
                dispatch(GetHistoryFailure(errInfor));
                message.error(errInfor);
            })
    }
}

export const addItem = () => {
    
}
 
const GetHistoryPending = () => {
    return {
        type: GET_HISTORY_PENDING
    }
}

const GetHistorySucess = (data) => {
    return {
        type: GET_HISTORY_SUCESS,
        data
    }
}

const GetHistoryFailure = (err) => {
    return {
        type: GET_HISTORY_FAILURE,
        err
    }
}