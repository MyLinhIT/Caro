import { GET_INFOMATION_SUCESS, GET_INFOMATION_PENDING } from "../contant";
import { GET_INFOMATION_FAILURE } from './../contant/index';


const initialState = {
    err: null,
    pending: false,
    account: null,
};

const getInfomationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_INFOMATION_PENDING: {
            return {
                ...state,
                pending: true,
            }
        }
        case GET_INFOMATION_SUCESS:
            return {
                ...state,
                pending: false,
                account: action.data,
            }
        case GET_INFOMATION_FAILURE:
            return {
                ...state,
                pending: false,
                err: action.err
            }
        default:
            return state;
    }
}

export default getInfomationReducer;