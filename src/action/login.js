import {
    LOGIN_SUCESS,
    LOGIN_PENDING,
    LOGIN_FAILURE,
    LOGOUT,
    LOCAL_API,
} from '../contant/index'
import axios from 'axios';
import { message } from 'antd';
import history from '../history'

export const login = ({ email, password }) => {
    return dispatch => {
        dispatch(LoginPending());
        setTimeout(() => {
            axios
                .post(`${LOCAL_API}/user/login`, {
                    email,
                    password
                })
                .then(res => {
                    localStorage.setItem('jwt_token', res.data.user.token);
                    dispatch(LoginSucess(res.data));
                    message.success("Chúc mừng, bạn đã đăng nhập thành công.")
                    history.push('/home');
                })
                .catch(err => {
                    const errInfor = err.response.data ? err.response.data : "Đã có lỗi xảy ra, vui lòng thử lại";
                    dispatch(LoginFailure(errInfor));
                    message.error(errInfor);
                })
        }, 1000)
    }
}

export const loginSocial = (data) => {
    return dispatch => {
        localStorage.setItem('jwt_token', data.user.token);
        dispatch(LoginSucess(data));
        message.success("Chúc mừng, bạn đã đăng nhập thành công.")
        history.push('/home');
    }
}

export const logout = () => {
    return dispatch => {
        dispatch(Logout());
        localStorage.removeItem('jwt_token');
    }
}

const LoginPending = () => {
    return {
        type: LOGIN_PENDING
    }
}
const LoginSucess = (data) => {
    return {
        type: LOGIN_SUCESS,
        data
    }
}

const LoginFailure = (err) => {
    return {
        type: LOGIN_FAILURE,
        err
    }
}

const Logout = () => {
    return {
        type: LOGOUT
    }
}