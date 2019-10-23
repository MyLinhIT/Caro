import React from 'react';
import './style.scss';
import { Form, Icon, Input, Button, Avatar } from 'antd';
import Header from '../../component/Header';
import { connect } from 'react-redux';
import * as RegisterAction from '../../action/register';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Register extends React.Component {
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                this.props.register({
                    email: values.email,
                    password: values.password,
                    displayName: values.displayName
                })
            }
        });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Mật khẩu nhập lại chưa đúng!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const emailError = isFieldTouched('email') && getFieldError('email');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const repasswordError = isFieldTouched('re-password') && getFieldError('re-password');
        const displayNameError = isFieldTouched('displayName') && getFieldError('displayName');
        return (
            <div className="register-page">
                <Header icon="user" text="Đăng nhập" link="/login" />
                <Form layout="vertical" onSubmit={this.handleSubmit} className="form-register">
                    <Avatar size={128} icon="user" style={{ backgroundColor: '#262626' }} />
                    <h3>Đăng ký</h3>
                    <Form.Item validateStatus={displayNameError ? 'error' : ''} help={displayNameError || ''}>
                        {getFieldDecorator('displayName', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên hiển thị.',
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="aliwangwang" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Tên hiển thị"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''}>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Email không đúng định dạng.',
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email.',
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Email"
                            />,
                        )}
                    </Form.Item>

                    <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu.'
                                }],
                        })(
                            <Input.Password
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Mật khẩu"
                                autoComplete="false"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={repasswordError ? 'error' : ''} help={repasswordError || ''}>
                        {getFieldDecorator('re-password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Vui lòng nhập lại mật khẩu.'
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(
                            <Input.Password
                                prefix={<Icon type="check-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                autoComplete="false"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button loading={this.props.state.pending} type="primary" icon="user" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <p style={{ color: "#fff" }}>Bạn đã có tài khoản? <a href="/login">Đăng nhập</a></p>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    state: state.register
})

const mapDispatchToProps = (dispatch) => ({
    register: (value) => dispatch(RegisterAction.register(value))
});

const WapperFormRegister = (Form.create({ name: 'horizontal_login' })(Register));

export default connect(mapStateToProps, mapDispatchToProps)(WapperFormRegister)