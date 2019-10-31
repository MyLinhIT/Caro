import './style.scss'

import React, { Component } from 'react'
import { Form, Icon, Input, Button, Modal } from 'antd';
import Header from '../../component/Header'
import { connect } from 'react-redux';
import * as InfomationAction from '../../action/infomation';
import history from '../../history';

function hasErrors(fieldsError) {
    const data = {
        email: fieldsError.email,
        displayName: fieldsError.displayName,
    }
    return Object.keys(data).some(field => data[field]);
}

function hasErrorsChangePW(fieldsError) {
    const data = {
        'new-password': fieldsError['new-password'],
        're-password': fieldsError['re-password'],
    }
    return Object.keys(data).some(field => data[field]);
}

class Infomation extends Component {

    state = { ...this.props.account, loadingCancel: false, visible: false, loadingPW: false, }

    componentWillMount = () => {
        this.props.getInfomation();
    }

    componentWillReceiveProps = (nextProps) => {
        console.log('nextProps', nextProps);
        console.log(this.state.user);
        if (nextProps.account.user !== this.state.user) {
            this.setState({
                user: nextProps.account.user
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.updateInfomation({ ...values, _id: this.state.user._id });
            }
        });
    };

    handleReset = e => {
        this.setState({
            loadingCancel: true
        })
        e.preventDefault();
        setTimeout(() => {
            this.props.form.setFieldsValue({
                displayName: this.state.user.displayName
            })
            this.setState({
                loadingCancel: false
            })
        }, 1000)

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        e.preventDefault();
        this.setState({ loadingPW: true });
        setTimeout(() => {
            this.setState({
                visible: false,
                loadingPW: false
            })
        }, 1000);
    };

    handleCancel = e => {
        e.preventDefault();
        this.setState({
            visible: false,
        });
        this.props.form.setFieldsValue({
            'new-password': '',
            're-password': ''
        })
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('new-password')) {
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
        const displayNameError = isFieldTouched('displayName') && getFieldError('displayName');
        const newpasswordError = isFieldTouched('new-password') && getFieldError('new-password');
        const repasswordError = isFieldTouched('re-password') && getFieldError('re-password');
        const { user, loadingCancel, loadingPW } = this.state;

        return (
            <div className="infomation-page">
                <Header />
                <h1>Thông tin cá nhân</h1>
                <Form layout="vertical" className="form-infomation" onSubmit={this.handleSubmit}>
                    <Form.Item validateStatus={displayNameError ? 'error' : ''} help={displayNameError || ''} label="Tên hiển thị">
                        {getFieldDecorator('displayName', {
                            initialValue: user.displayName,
                            rules: [
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên hiển thị.',
                                },
                            ],
                        })(
                            <Input
                                placeholder="Tên hiển thị"
                                autoFocus={true}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''} label="Email">
                        {getFieldDecorator('email', {
                            initialValue: user.email,
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
                                placeholder="Email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''} label="Mật khẩu">
                        {getFieldDecorator('password', {
                            initialValue: user.password,
                            rules: [{ required: true, message: 'Vui lòng nhập mật khẩu.' }],
                        })(
                            <Input.Password
                                type="password"
                                placeholder="Mật khẩu"
                                readOnly
                                addonAfter={<Icon type="edit" onClick={this.showModal} />}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item >
                        <Button loading={loadingCancel} type="danger" onClick={this.handleReset} icon="close-square-o" style={{ width: "40%" }}>
                            Hủy
                        </Button>
                        <Button loading={this.props.pending} type="primary" icon="save" htmlType="submit" disabled={hasErrors(getFieldsError())} style={{ width: "60%" }}>
                            Lưu
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <Button type="ghost" onClick={() => history.goBack("/home")} icon="arrow-left" style={{ width: "40%" }}>
                            Về trang chủ
                        </Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="Thay đổi mật khẩu"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="danger" icon="close-square-o" onClick={this.handleCancel}>
                            Hủy
                        </Button>,
                        <Button key="submit" icon="save" type="primary" htmlType="submit" loading={loadingPW} onClick={this.handleOk} disabled={hasErrorsChangePW(getFieldsError())}>
                            Lưu
                        </Button>,
                    ]}
                >

                    <Form.Item validateStatus={newpasswordError ? 'error' : ''} help={newpasswordError || ''}>
                        {getFieldDecorator('new-password', {
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
                </Modal>
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.getInfomation.account,
        pending: state.getInfomation.pending,
    }

}

const mapDispatchToProps = (dispatch) => ({
    getInfomation: () => dispatch(InfomationAction.getInfomation()),
    updateInfomation: (values) => dispatch(InfomationAction.updateInfomation(values))
})

const WapperFormLogin = (Form.create({ name: 'horizontal_login' })(Infomation));
export default connect(mapStateToProps, mapDispatchToProps)(WapperFormLogin)