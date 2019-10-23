import {
    ADD_ITEM, RESET, MODIFIED_HISTORY,
} from '../contant/index'

export const AddItem = (data) => {
    return {
        type: ADD_ITEM,
        data
    }
}

export const Reset = () => {
    return {
        type: RESET
    }
}

export const ModifiedHistory = (history) => {
    return {
        type: MODIFIED_HISTORY,
        history
    }
}

