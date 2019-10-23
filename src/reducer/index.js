import { combineReducers } from 'redux'
import game from './game'
import login from './login'
import register from './register'

export default combineReducers({
    game,
    login,
    register
})