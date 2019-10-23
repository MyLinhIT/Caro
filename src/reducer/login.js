import {
    LOGIN_SUCESS,
    LOGIN_PENDING,
    LOGIN_FAILURE,
    LOGOUT
} from '../contant/index'

const initialState = {
    pending: false,
    err: null,
    account: null,
    isLoggin: false,
};

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_PENDING:
            return {
                ...state,
                pending: true
            }
        case LOGIN_SUCESS:
            return {
                ...state,
                pending: false,
                account: action.data,
                isLoggin: true
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                pending: false,
                err: action.err
            }
        case LOGOUT: {
            return {
                ...state,
                pending: false,
                isLoggin: false
            }
        }
        default:
            return state;
    }
}

export default loginReducer;