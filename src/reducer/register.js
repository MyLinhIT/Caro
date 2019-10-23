import {
    REGISTER_SUCESS,
    REGISTER_FAILURE,
    REGISTER_PENDING,
} from '../contant/index'

const initialState = {
    pending: false,
    err: null,
    account: null,
};

const registerReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_PENDING:
            return {
                ...state,
                pending: true
            }
        case REGISTER_SUCESS:
            return {
                ...state,
                pending: false,
                account: action.data,
            }
        case REGISTER_FAILURE:
            return {
                ...state,
                pending: false,
                err: action.err
            }
        default:
            return state;
    }
}

export default registerReducer;