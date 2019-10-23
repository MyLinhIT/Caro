import React from 'react'
import { Affix, Avatar } from 'antd';
import './style.scss'
import logo from '../../asset/logo.png';
const Header = () => {
    return (
        <Affix offsetTop={0} className="header">
            <div className="header__logo">
                <Avatar shape="square" size="large" src={logo} />
                <span className="header__logo--title">CARO</span>
            </div>
            {/* <Button type="primary" icon={icon} onClick={() => history.push(link)}>
                {text}
            </Button> */}
        </Affix>
    )
}

export default Header