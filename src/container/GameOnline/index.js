import './style.scss';

import React from 'react';
import io from 'socket.io-client';
import { message, Button, Input, Avatar, Modal } from 'antd';
import Board from '../../component/Board';
import { connect } from 'react-redux';
import * as handleFunction from '../../Helper/handleFunction';
import * as InfomationAction from '../../action/infomation';

class GameOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(400).fill(null)
        }
      ],
      xIsNext: true,
      isDisable: false,
      indexCheck: -1,
      stepNumber: 0,
      win: false,
      loading: false,
      isPlaying: false,
      message: '',
      messages: [],
      ID: '',
      visibleWin: false,
      visibleLost: false,
      isRePlaying: false,
      pattern: {}
    };
  }

  componentWillMount() {
    this.props.getInfomation();

    this.setState({
      ID: ('' + Math.random()).substring(2, 7)
    });
    this.socket = io('localhost:4500');

    this.socket.on('RECEIVE_MESSAGE', function(data) {
      addMessage(data);
    });

    this.socket.on('PLAYED', data => {
      handleOnlinePlay(data);
    });

    this.socket.on('END_GAME', data => {
      handleWin(data);
    });

    this.socket.on('RE_PLAYED', data => {
      rePlay(data);
    });

    this.socket.on('START', data => {
      message.success('Chúc mừng bạn! Đã có đồng đội, mời bạn chơi game.');
      const pattern = data.filter(item => item.id !== this.state.ID);
      this.setState({
        loading: false,
        isPlaying: true,
        pattern: pattern[0].user
      });
    });

    const addMessage = data => {
      this.setState({
        messages: [
          ...this.state.messages,
          { ...data, isSending: this.state.ID === data.ID }
        ]
      });
    };

    const handleOnlinePlay = data => {
      this.setState({
        history: data.history,
        stepNumber: data.stepNumber,
        xIsNext: data.xIsNext,
        isDisable: this.state.ID === data.ID
      });
    };

    const rePlay = data => {
      message.success('Đồng đội bạn đã xác nhận, mời tiếp tục');
      this.setState({
        isRePlaying: this.state.ID === data.ID,
        isDisable: this.state.ID === data.ID
      });
    };

    const handleWin = data => {
      this.socket.emit('DISCONNECT');
      data.ID === this.state.ID ? this.showModalWin() : this.showModalLost();
    };
  }

  handleClick = i => {
    const {
      xIsNext,
      history,
      indexCheck,
      stepNumber,
      isPlaying,
      isRePlaying
    } = this.state;

    if (!isPlaying) {
      message.info('Bạn chưa tìm người chơi, mời tìm người để chơi.');
      return null;
    }

    if (isRePlaying) {
      message.info('Mời bạn chờ đồng đội xác nhận.');
      return null;
    }

    const historyNew = history.slice(0, stepNumber + 1);
    const current = historyNew[historyNew.length - 1];
    const squares = current.squares.slice();

    if (handleFunction.calculateWinner(indexCheck, squares || squares[i])) {
      if (handleFunction.checkBlock(indexCheck, squares || squares[i])) {
        return;
      }
    }

    if (squares[i] === null) {
      squares[i] = xIsNext ? 'X' : 'O';

      this.setState(
        {
          history: historyNew.concat([
            {
              squares: squares
            }
          ]),
          xIsNext: !xIsNext,
          indexCheck: i,
          stepNumber: historyNew.length
        },
        () => {
          const { xIsNext, history, stepNumber, ID } = this.state;
          setTimeout(() => {
            this.socket.emit('PLAY', { history, stepNumber, xIsNext, ID });
          }, 100);
        }
      );
    }
  };

  findPlayer = () => {
    this.socket = io('localhost:4500');
    this.setState(
      {
        loading: true
      },
      () =>
        setTimeout(() => {
          this.socket.emit('FIND_PLAYER', {
            id: this.state.ID,
            user: this.props.account.user
          });
        }, 1000)
    );
  };

  sendMessage = e => {
    const { isPlaying } = this.state;

    if (!isPlaying) {
      message.info('Bạn chưa tìm người chơi, mời tìm người để chơi.');
      return null;
    }
    e.preventDefault();

    this.socket.emit('SEND_MESSAGE', {
      avatar: this.props.account.user.avatar,
      message: this.state.message,
      ID: this.state.ID
    });
    this.setState({ message: '' });
  };

  showModalWin = () => {
    this.setState({
      visibleWin: true
    });
  };

  handleOKWin = () => {
    this.setState(
      {
        indexCheck: -1,
        stepNumber: 0,
        history: [
          {
            squares: Array(400).fill(null)
          }
        ],
        visibleWin: false,
        isDisable: true,
        isRePlaying: true
      },
      () => {
        this.socket = io('localhost:4500');
        this.socket.emit('RE_PLAY', {
          ID: this.state.ID
        });
      }
    );
  };

  handleCancelWin = e => {
    this.socket.emit('DISCONNECT');
    this.setState({
      visibleWin: false,
      isPlaying: false,
      indexCheck: -1,
      stepNumber: 0,
      history: [
        {
          squares: Array(400).fill(null)
        }
      ],
      pattern: {},
      messages: []
    });
  };

  showModalLost = () => {
    this.setState({
      visibleLost: true
    });
  };

  handleOKLost = () => {
    this.setState(
      {
        indexCheck: -1,
        stepNumber: 0,
        history: [
          {
            squares: Array(400).fill(null)
          }
        ],
        visibleLost: false,
        isDisable: true,
        isRePlaying: true
      },
      () => {
        this.socket = io('localhost:4500');
        this.socket.emit('RE_PLAY', {
          ID: this.state.ID
        });
      }
    );
  };

  handleCancelLost = e => {
    this.socket.emit('DISCONNECT');
    this.setState({
      visibleLost: false,
      isPlaying: false,
      indexCheck: -1,
      stepNumber: 0,
      history: [
        {
          squares: Array(400).fill(null)
        }
      ],
      pattern: {},
      messages: []
    });
  };

  render() {
    const {
      history,
      stepNumber,
      isDisable,
      indexCheck,
      ID,
      isPlaying,
      loading,
      pattern
    } = this.state;

    let user = {};
    if (this.props.account) {
      user = this.props.account.user;
    }

    const current = history[stepNumber];
    const squares = current.squares;
    const i = indexCheck;
    const winner = handleFunction.calculateWinner(i, squares);

    let nonBlock = null;

    if (winner) {
      nonBlock = handleFunction.checkBlock(i, squares);
    }

    let status;

    if (nonBlock) {
      this.socket.emit('WIN', { ID });
    } else {
      status = !isDisable ? 'Tới lượt bạn' : 'Tới lượt đối thủ';
    
    }
    return (
      <div>
        <div className="game">
          <div className="game-body">
            <div className="game-info">
              <div className="info-user">
                <Avatar src={user.avatar} size={96} shape="circle" />
                <div className="info">
                  <span>{user.displayName}</span>
                  <span>{user.birthday ? user.birthday : null}</span>
                  <span>
                    {' '}
                    {user.gender
                      ? user.gender === 'female'
                        ? 'Nữ'
                        : 'Name'
                      : null}
                  </span>
                </div>
              </div>
              <div className="game-group-button">
                <div className="status" style={{ color: '#ffff00' }}>
                  {status}
                </div>
                <div className="group-button">
                  <Button
                    type="primary"
                    disabled={isPlaying}
                    loading={loading}
                    onClick={this.findPlayer}
                  >
                    Tìm người chơi
                  </Button>
                  <Button type="primary" disabled={!isPlaying}>
                    Xin hòa
                  </Button>
                  <Button type="primary" disabled={!isPlaying}>
                    Đầu hàng
                  </Button>
                  <Button type="primary" disabled={!isPlaying}>
                    Quay lại bước đi
                  </Button>
                </div>
              </div>
            </div>
            <div className="game-board">
              <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                disable={isDisable}
                indexCheck={i}
              />
            </div>
            <div className="game-chat">
              <div className="content">
                {pattern ? (
                  <div
                    className="info-user"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    <Avatar src={pattern.avatar} size={32} shape="circle" />
                    <div className="info">
                      <span>{pattern.displayName}</span>
                    </div>
                  </div>
                ) : null}
                <div className="group-message">
                  {this.state.messages.map((message, index) => {
                    return (
                      <div
                        key={index}
                        className={message.isSending ? 'sending' : 'send'}
                        style={{ display: 'flex' }}
                      >
                        <Avatar src={message.avatar} size={32} shape="circle" />
                        <div>
                          <span>{message.message}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="group-button">
                  <Input
                    placeholder="Nhập nội dung tin nhắn..."
                    value={this.state.message}
                    onChange={ev => this.setState({ message: ev.target.value })}
                    onPressEnter={this.sendMessage}
                  />
                  <Button type="primary" onClick={this.sendMessage}>
                    Gửi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        <Modal
          title="Kết thúc game"
          visible={this.state.visibleWin}
          onCancel={this.handleCancelWin}
          onOk={this.handleOKWin}
          footer={[
            <Button key="back" onClick={this.handleCancelWin}>
              Đóng
            </Button>,
            <Button key="submit" onClick={this.handleOKWin}>
              Chơi lại
            </Button>
          ]}
        >
          Xin chúc mừng, bạn đã thắng
        </Modal>
        <Modal
          title="Kết thúc game"
          visible={this.state.visibleLost}
          onCancel={this.handleCancelLost}
          onOk={this.handleOKLost}
          footer={[
            <Button key="back" onClick={this.handleCancelLost}>
              Đóng
            </Button>,
            <Button key="submit" onClick={this.handleOKLost}>
              Chơi lại
            </Button>
          ]}
        >
          Xin chia buồn, bạn đã thua
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    account: state.getInfomation.account
  };
};

const mapDispatchToProps = dispatch => ({
  getInfomation: () => dispatch(InfomationAction.getInfomation())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOnline);
