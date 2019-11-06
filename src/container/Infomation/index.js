import './style.scss'

import React, { Component } from 'react'
import { Form, Input, Button, DatePicker, Select, Avatar, Upload, message } from 'antd';
import moment from 'moment'

import Header from '../../component/Header'
import { connect } from 'react-redux';
import * as InfomationAction from '../../action/infomation';
import history from '../../history';
import { storage } from '../../Firebase';
import ChangePassword from '../ChangePassword';

const { Option } = Select;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Bạn chỉ có thể tải file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Kích thước ảnh phải nhỏ hơn 2MB, vui lòng tải lại!');
    }
    return isJpgOrPng && isLt2M;
}

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class Infomation extends Component {

    state = {
        ...this.props.account,
        loadingCancel: false,
        visible: false,
        loadingImage: false,
        loadingSave: this.props.pending,
        imageUrl: '',
    }

    componentWillMount = () => {
        this.props.getInfomation();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.account.user !== this.state.user) {
            this.setState({
                user: nextProps.account.user,
                loadingSave: nextProps.pending
            })
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            loadingSave: true
        })
        const birthday = this.props.form.getFieldValue('birthday') ? this.props.form.getFieldValue('birthday').format("DD-MM-YYYY") : "";
        this.props.form.validateFields((err) => {
            if (!err) {
                if (this.state.imageUrl) {
                    this.handleUploadFirebase(birthday);
                }
                else {
                    this.props.updateInfomation({ ...this.props.form.getFieldsValue(), birthday: birthday, _id: this.state.user._id });
                }
            }
        });
    };

    handleReset = e => {
        this.setState({
            loadingCancel: true
        })
        e.preventDefault();
        const { user } = this.state;
        setTimeout(() => {
            this.props.form.setFieldsValue({
                displayName: user.displayName,
                email: user.email,
                birthday: user.birthday ? moment(user.birthday, 'DD-MM-YYYY') : null,
                gender: user.gender,

            })
            this.setState({
                loadingCancel: false,
                imageUrl: user.avatar
            })
        }, 1000)

    }

    // Handle Upload avatar

    handleChangeUpload = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loadingImage: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loadingImage: false,
                }),
            );
        }
    };

    handleUploadFirebase = (birthday) => {
        const { imageUrl, user } = this.state;
        const uploadTask = storage.ref().child(`/images/${user._id}`).putString(imageUrl.substring(23), 'base64', { contentType: 'image/jpeg' })
        uploadTask.on(
            "state_changed",
            snapshot => {
            },
            error => {
                message.error("Có lỗi khi upload file!")
            },
            () => {
                storage
                    .ref("images")
                    .child(user._id)
                    .getDownloadURL()
                    .then(url => {
                        this.props.updateInfomation({ ...this.props.form.getFieldsValue(), avatar: url || user.avatar, birthday: birthday, _id: this.state.user._id });
                    });
            }
        );
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    handleOK = () => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const emailError = isFieldTouched('email') && getFieldError('email');
        const displayNameError = isFieldTouched('displayName') && getFieldError('displayName');

        const { user, loadingCancel, imageUrl, loadingSave, loadingImage } = this.state;
        const check = user.facebookID || user.googleID ? true : false

        return (
            <div className="infomation-page">
                <Header />
                <Form layout="vertical" className="form-infomation" onSubmit={this.handleSubmit}>
                    <div className="clearfix" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Avatar size={128} src={imageUrl || user.avatar || ""} />
                        <Upload
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeUpload}
                        >
                            <Button disabled={check} icon={loadingImage ? 'loading' : 'upload'} style={{ marginTop: "10px" }}>Tải lên</Button>
                        </Upload>
                    </div>
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
                                readOnly={check}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item validateStatus={emailError ? 'error' : ''} help={emailError || ''} label="Email">
                        {getFieldDecorator('email', {
                            initialValue: user.email,
                            rules: [
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email.',
                                },
                            ],
                        })(
                            <Input
                                placeholder="Email"
                                readOnly={check}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Ngày sinh">
                        {getFieldDecorator('birthday',
                            { initialValue: user.birthday ? moment(user.birthday, 'DD-MM-YYYY') : '' })(
                                <DatePicker placeholder="Chọn ngày sinh" format="DD-MM-YYYY" />
                            )}
                    </Form.Item>
                    <Form.Item label="Giới tính">
                        {getFieldDecorator('gender', { initialValue: user.gender, })(
                            <Select
                                placeholder="Chọn giới tính"
                            >
                                <Option value="female">Nữ</Option>
                                <Option value="male">Nam</Option>
                                <Option value="orther">Khác</Option>
                            </Select>,
                        )}
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" onClick={this.showModal} icon="redo" hidden={check}>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <Button loading={loadingCancel} type="danger" onClick={this.handleReset} icon="close-square-o" style={{ width: "40%" }}>
                            Hủy
                        </Button>
                        <Button loading={loadingSave} type="primary" icon="save" htmlType="submit" disabled={hasErrors(getFieldsError()) || loadingImage} style={{ width: "60%" }}>
                            Lưu
                        </Button>
                    </Form.Item>
                    <Form.Item >
                        <Button onClick={() => history.push("/home")} icon="arrow-left" style={{ width: "40%" }}>
                            Trang chủ
                        </Button>
                    </Form.Item>
                </Form>
                <ChangePassword visible={this.state.visible} handleCancel={this.handleCancel} handleOK={this.handleOK} _id={this.state.user._id} />
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
    updateInfomation: (values) => dispatch(InfomationAction.updateInfomation(values)),
})

const WapperFormLogin = (Form.create({ name: 'horizontal_login' })(Infomation));
export default connect(mapStateToProps, mapDispatchToProps)(WapperFormLogin)