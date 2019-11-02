
import { LOCAL_API, CHANGE_PASSWORD_PENDING, CHANGE_PASSWORD_SUCESS, CHANGE_PASSWORD_FAILURE } from './../contant/index';
import axios from 'axios';
import { message } from 'antd';

export const changePassword = ({ password, newPassword, _id }) => {
    return dispatch => {
        dispatch(ChangePasswordPending());
        axios
            .post(`${LOCAL_API}/change-password?_id=${_id}`, {
                password, newPassword
            })
            .then((res) => {
                dispatch(ChangePasswordSucess());
                // console.log(res);
                message.success("Thay đổi mật khẩu thành công")
            })
            .catch(err => {
                dispatch(ChangePasswordFailure());
                const errInfor = err.response.data ? err.response.data : "Đã có lỗi xảy ra, vui lòng thử lại";
                message.error(errInfor);
            })
    }
}


const ChangePasswordPending = () => {
    return {
        type: CHANGE_PASSWORD_PENDING
    }
}

const ChangePasswordSucess = () => {
    return {
        type: CHANGE_PASSWORD_SUCESS
    }
}

const ChangePasswordFailure = () => {
    return {
        type: CHANGE_PASSWORD_FAILURE
    }
}