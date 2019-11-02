import React, { Component } from 'react'
import { Form, Icon, Input, Button, Modal } from 'antd';

import { connect } from 'react-redux';
import { changePassword } from './../../action/change-password';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class ChangePassword extends Component {

    state = {
        loading: this.props.pending,
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.pending !== this.state.loading) {
            this.setState({
                loading: nextProps.pending
            })
        }
    }


    handleOk = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.changePassword({ ...values, _id: this.props._id });
            }
        });
    };

    handleCancel = e => {
        e.preventDefault();
        this.props.form.setFieldsValue({
            'password': '',
            'newPassword': '',
            'rePassword': ''
        })
        this.props.handleCancel();
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('Mật khẩu nhập lại chưa đúng!');
        } else {
            callback();
        }
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const newpasswordError = isFieldTouched('newPassword') && getFieldError('newPassword');
        const repasswordError = isFieldTouched('rePassword') && getFieldError('rePassword');

        const { loading } = this.state;

        return (

            <div>
                <Modal
                    title="Thay đổi mật khẩu"
                    visible={this.props.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="danger" icon="close-square-o" onClick={this.handleCancel}>
                            Hủy
                        </Button>,
                        <Button key="submit" icon="save" type="primary" htmlType="submit" loading={loading} onClick={this.handleOk} disabled={hasErrors(getFieldsError())}>
                            Lưu
                        </Button>,
                    ]}
                >
                    <Form layout="vertical">
                        <Form.Item label="Mật khẩu" style={{ textAlign: "left" }} validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Vui lòng nhập mật khẩu.' }],
                            })(
                                <Input.Password
                                    type="password"
                                    placeholder="Mật khẩu"
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item style={{ textAlign: "left" }} label="Mật khẩu mới" validateStatus={newpasswordError ? 'error' : ''} help={newpasswordError || ''}>
                            {getFieldDecorator('newPassword', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu.'
                                    }],
                            })(
                                <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    autoComplete="false"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item style={{ textAlign: "left" }} label="Nhập lại mật mới" validateStatus={repasswordError ? 'error' : ''} help={repasswordError || ''}>
                            {getFieldDecorator('rePassword', {
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
                    </Form>
                </Modal >
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        pending: state.changePasswordReducer.pending,
    }

}

const mapDispatchToProps = (dispatch) => ({
    changePassword: (values) => dispatch(changePassword(values))
})

const WapperFormLogin = (Form.create({ name: 'horizontal_login' })(ChangePassword));
export default connect(mapStateToProps, mapDispatchToProps)(WapperFormLogin)