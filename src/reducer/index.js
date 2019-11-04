import { combineReducers } from 'redux'
import game from './game'
import login from './login'
import register from './register'
import getInfomation from './infomation'
import changePasswordReducer from './change-password'
import gameOnlineReducer from './game-online';

export default combineReducers({
    game,
    login,
    register,
    getInfomation,
    changePasswordReducer,
    gameOnlineReducer
})