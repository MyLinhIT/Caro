
import { API, GET_INFOMATION_SUCESS, GET_INFOMATION_FAILURE, GET_INFOMATION_PENDING } from './../contant/index';
import axios from 'axios';
import { message } from 'antd';

export const getInfomation = () => {
    return dispatch => {
        axios
            .get(`${API}/me`, { headers: { "Authorization": `Token ${localStorage.getItem('jwt_token')}` } })
            .then(res => {
                dispatch(GetInfomationSucess(res.data));
            })
            .catch(err => {
                const errInfor = err.response.data ? err.response.data : "Đã có lỗi xảy ra, vui lòng thử lại";
                dispatch(GetInfomationFailure(errInfor));
                message.error(errInfor);
            })
    }
}

export const updateInfomation = ({ email, displayName, _id, birthday, gender, avatar }) => {
    return dispatch => {
        dispatch(GetInfomationPending());
        axios
            .post(`${API}/update?_id=${_id}`, {
                email,
                displayName,
                birthday,
                gender,
                avatar
            })
            .then(res => {
                localStorage.setItem('jwt_token', res.data.user.token);
                message.success("Thay đổi thông tin thành công")
                dispatch(GetInfomationSucess(res.data));
            })
            .catch(err => {
                const errInfor = err.response.data ? err.response.data : "Đã có lỗi xảy ra, vui lòng thử lại";
                dispatch(GetInfomationFailure(errInfor));
                message.error(errInfor);
            })
    }
}


const GetInfomationPending = () => {
    return {
        type: GET_INFOMATION_PENDING
    }
}

const GetInfomationSucess = (data) => {
    return {
        type: GET_INFOMATION_SUCESS,
        data
    }
}

const GetInfomationFailure = (err) => {
    return {
        type: GET_INFOMATION_FAILURE,
        err
    }
}

