
import { CHANGE_PASSWORD_PENDING, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_SUCESS } from './../contant/index';


const initialState = {
    pending: false,
};

const changePasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_PENDING: {
            return {
                ...state,
                pending: true,
            }
        }
        case CHANGE_PASSWORD_SUCESS:
            return {
                ...state,
                pending: false,
            }
        case CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                pending: false,
            }
        default:
            return state;
    }
}

export default changePasswordReducer;