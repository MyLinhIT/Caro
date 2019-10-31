
import { LOCAL_API, GET_INFOMATION_SUCESS, GET_INFOMATION_FAILURE, GET_INFOMATION_PENDING } from './../contant/index';
import axios from 'axios';
import { message } from 'antd';

export const getInfomation = () => {
    return dispatch => {
        axios
            .get(`${LOCAL_API}/me`, { headers: { "Authorization": `Token ${localStorage.getItem('jwt_token')}` } })
            .then(res => {
                dispatch(GetInfomationSucess(res.data));
            })
            .catch(err => {
                dispatch(GetInfomationFailure(err.response.data));
                message.error(err.response.data);
            })
    }
}

export const updateInfomation = ({ email, displayName, _id }) => {
    return dispatch => {
        dispatch(GetInfomationPending());
        axios
            .put(`${LOCAL_API}/update?_id=${_id}`, {
                email,
                displayName
            })
            .then(res => {
                localStorage.setItem('jwt_token', res.data.user.token);
                message.success("Thay đổi thông tin thành công")
                dispatch(GetInfomationSucess(res.data));
            })
            .catch(err => {
                dispatch(GetInfomationFailure(err.response.data));
                message.error(err.response.data);
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
