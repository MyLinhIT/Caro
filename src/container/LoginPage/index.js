import React from 'react';
import './style.scss';
import { Form, Icon, Input, Button, Avatar } from 'antd';
import Header from '../../component/Header';
import { connect } from 'react-redux';
import * as LoginAction from '../../action/login';


import { LOCAL_API } from '../../contant'

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Login extends React.Component {

    state = this.props.state;

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values)
            }
        });
    };

    handleLoginFacebook = e => {
        e.preventDefault();
        window.location.replace(`${LOCAL_API}/auth/facebook`);
    }

    handleLoginGoogle = e => {
        e.preventDefault();
        window.location.replace(`${LOCAL_API}/auth/google`);
    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.state !== this.state) {
            this.setState({
                state: nextProps.state
            })
        }
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div className="login-page">
                <Header icon="user" text="Đăng ký" link="/register"></Header>
                <Form layout="vertical" onSubmit={this.handleSubmit} className="form-login">
                    <Avatar size={128} icon="user" style={{ backgroundColor: '#262626' }} />
                    <h3>Đăng nhập</h3>
                    <Form.Item className="fb-gg w-100" style={{ display: "flex", flexDirection: "row" }}>
                        <Button type="primary" onClick={this.handleLoginFacebook}>
                            <Icon type="facebook" theme="filled" />
                            Facebook
                        </Button>
                        <Button type="danger" onClick={this.handleLoginGoogle}>
                            <Icon type="google-square" theme="filled" />
                            Google
                        </Button>
                    </Form.Item>
                    <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng!',
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email.',
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Vui lòng nhập mật khẩu.' }],
                        })(
                            <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Mật khẩu"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item >
                        <Button loading={this.props.state.pending} type="primary" icon="login" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <p style={{ color: "#fff" }}>Bạn không có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                    </Form.Item>
                </Form >
            </div >
        );
    }
}
const mapStateToProps = (state) => ({
    state: state.login
})

const mapDispatchToProps = (dispatch) => ({
    login: (value) => dispatch(LoginAction.login(value)),
});

const WapperFormLogin = (Form.create({ name: 'horizontal_login' })(Login));

export default connect(mapStateToProps, mapDispatchToProps)(WapperFormLogin)