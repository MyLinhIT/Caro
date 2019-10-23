import {
    REGISTER_SUCESS,
    REGISTER_PENDING,
    REGISTER_FAILURE,
} from '../contant/index'
import axios from 'axios';
import { message } from 'antd';
import history from '../history'

export const register = ({ email, password, displayName }) => {
    return dispatch => {
        dispatch(RegisterPending());
        setTimeout(() => {
            axios
                .post('https://caro-1612334-api.herokuapp.com/user/register', {
                    email,
                    password,
                    displayName
                })
                .then(res => {
                    dispatch(RegisterSucess(res.data));
                    message.success("Chúc mừng, bạn đã đăng ký thành công.Vui lòng đăng nhập.")
                    history.push('/login');
                })
                .catch(err => {
                    dispatch(RegisterFailure(err.response.data));
                    message.error(err.response.data);
                })
        }, 1000)
    }
}

const RegisterPending = () => {
    return {
        type: REGISTER_PENDING
    }
}

const RegisterSucess = (data) => {
    return {
        type: REGISTER_SUCESS,
        data
    }
}

const RegisterFailure = (err) => {
    return {
        type: REGISTER_FAILURE,
        err
    }
}
