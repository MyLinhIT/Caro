
import React from 'react';
import './index.css';
import Login from './container/LoginPage';
import Register from './container/RegisterPage';
import AfterLogin from './container/AfterLogin';
import PageNotFound from './component/404Page';
import Game from './container/Game'
import Home from './container/Home';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Infomation from './container/Infomation/index';

const App = (props) => {
    return (
        <Switch>
            <Route exact path="/">
                {props.isLoggin ? <Redirect to="/home" /> : <Redirect to="/login" />}
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/register">
                <Register />
            </Route>
            <Route path="/after-login">
                <AfterLogin />
            </Route>
            <Route path="/home">
                {props.isLoggin ? <Home /> : <Redirect to="/login" />}
            </Route>
            <Route path="/play">
                {props.isLoggin ? <Game /> : <Redirect to="/login" />}
            </Route>
            <Route path="/me">
                {localStorage.getItem("jwt_token") ? <Infomation /> : <Redirect to="/login" />}
            </Route>
            <Route path="*">
                <PageNotFound />
            </Route>
        </Switch>
    )
}

const mapStateToProps = state => ({
    isLoggin: state.login.isLoggin
})

export default connect(mapStateToProps)(App)


