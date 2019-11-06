import React from 'react';
import Header from '../../component/Header';
import Timeline from '../../component/Timeline';
import './style.scss';
import { Button, Icon } from 'antd';
import history from '../../history';
import { connect } from 'react-redux';
import * as LogInAction from '../../action/login';

const Home = props => {
  return (
    <div className="home">
      <Header />
      <h1>Caro Việt Nam</h1>
      <div className="group-button">
        <Button.Group size="large">
          <Button type="primary" onClick={() => history.push('/me')}>
            Quản lý tài khoản
            <Icon type="setting" />
          </Button>
          <Button type="primary" onClick={() => props.logout()}>
            Đăng xuất
            <Icon type="logout" />
          </Button>
        </Button.Group>
      </div>

      <div className="section">
        <div className="section__content">
          <Timeline text={props.account.user.displayName} />
          <div className="group-button">
            <Button.Group size="large">
              <Button type="primary" onClick={() => history.push('/play')}>
                Chơi với máy
                <Icon type="play-circle" />
              </Button>
              <Button
                type="primary"
                onClick={() => history.push('/play-online')}
              >
                Chơi online
                <Icon type="play-square" />
              </Button>
            </Button.Group>
          </div>
        </div>
        <div className="section__image">
          <div className="XO1">X</div>
          <div className="XO2">O</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  account: state.login.account
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(LogInAction.logout())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
