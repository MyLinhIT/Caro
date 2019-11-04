import { ADD_ITEM, RESET, MODIFIED_HISTORY } from '../contant/index';

const initialState = {
    history: [{
        squares: Array(400).fill(null)
    }]
}

const createGame = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                history: state.history.concat([{
                    squares: action.data
                }]),
            }
        case RESET:
            const history = [{
                squares: Array(400).fill(null)
            }];
            return {
                ...state,
                history: history
            }
        case MODIFIED_HISTORY:
            return {
                ...state,
                history: action.history
            }
        default:
            return state;
    }
}

export default createGame;