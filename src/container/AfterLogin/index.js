import React, { Component } from 'react'
import { Spin } from 'antd';
import { connect } from 'react-redux';
import * as LoginAction from '../../action/login';

class AfterLogin extends Component {

    componentWillMount = () => {
        const token = new URL(window.location.href).searchParams.get('token');
        if (token) {
            this.props.loginSocial(JSON.parse(token));
        }
    }

    render() {
        return (
            <div style={{ marginTop: "50vh" }}>
                <Spin tip="Đang đăng nhập..." size="large" style={{ color: "fff" }} >
                </Spin>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    loginSocial: (user) => dispatch(LoginAction.loginSocial(user)),
});

export default connect(null, mapDispatchToProps)(AfterLogin)