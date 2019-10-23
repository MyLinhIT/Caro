import React from 'react'
import { Steps, Icon } from 'antd';
import './style.scss'
const { Step } = Steps;

const Timeline = ({ text }) => {
    return (
        <div className="timeline">
            <h3>Xin chào, {text}!!!</h3>
            <Steps direction="vertical" size='large' current={3}>
                {/* <Step title="Đăng ký" description="Bạn cần đăng kí một tài khoản." icon={<Icon type="user" style={{ fontSize: '36px', color: '#ffffff' }} />} /> */}
                {/* <Step title="Đăng nhập" description="Bạn đăng nhập tài khoản vào trang web." icon={<Icon type="login" style={{ fontSize: '36px', color: '#ffffff' }} />} /> */}
                <Step title="Chúc mừng bạn! Bạn đã có thể chơi game." description="Nhấn nút 'Chơi game' phía dưới để chơi." icon={<Icon type="play-circle" style={{ fontSize: '36px', color: '#ffffff' }} />} />
            </Steps>
        </div>
    )
}

export default Timeline
