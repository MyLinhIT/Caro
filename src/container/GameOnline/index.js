import './style.scss';
import {API} from '../../contant'

import React from 'react';
import io from 'socket.io-client';
import { message, Button, Input, Avatar } from 'antd';
import Board from '../../component/Board';
import { connect } from 'react-redux';
import * as handleFunction from '../../Helper/handleFunction';
import * as InfomationAction from '../../action/infomation';
import Modal from '../../component/Modal';

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
      visibleSurrender: false,
      pattern: {}
    };
  }

  componentWillMount() {
    this.props.getInfomation();

    this.setState({
      ID: ('' + Math.random()).substring(2, 7)
    });
    this.socket = io(API);

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

    this.socket.on('WANT_UNDO', data => {
      if (this.state.ID !== data.ID) {
        handleUndoServer(data);
      }
    });

    this.socket.on('REPLIED_UNDO', data => {
      if (this.state.ID !== data.ID) {
        if (data.status) {
          handleExceptUndo(data);
          message.info('Mời bạn đánh lại, đối thủ của bạn đã chấp nhận.');
        } else {
          message.info('Rất tiếc, đối thủ bạn không chấp nhận.');
        }
      }
    });

    this.socket.on('SURRENDERED', data => {
      if (this.state.ID !== data.ID) {
        message.info('Đối thủ đã đầu hàng, bạn đã thắng.');
      } else {
        message.info('Bạn đã đầu hàng');
      }
      this.handleCancelWin();
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
      const isDisable = data.isUndo
        ? this.state.ID !== data.ID
          ? true
          : false
        : this.state.ID === data.ID;
      this.setState({
        history: data.history,
        stepNumber: data.stepNumber,
        xIsNext: data.xIsNext,
        isDisable: isDisable
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

    const handleUndoServer = () => {
      this.showModalUndo();
    };

    const handleExceptUndo = data => {
      const { xIsNext, history, stepNumber, ID } = this.state;
      this.socket.emit('PLAY', {
        history,
        stepNumber: stepNumber - 1,
        xIsNext: !xIsNext,
        ID,
        isUndo: true
      });
      this.setState({
        stepNumber: this.state.stepNumber - 1,
        xIsNext: !this.state.xIsNext
      });
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

  handleUndo = () => {
    message.info('Xin chờ đối thủ phản hồi!');
    this.socket.emit('UNDO', { ID: this.state.ID });
  };

  findPlayer = () => {
    this.socket = io(API);
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
        this.socket = io(API);
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
        this.socket = io(API);
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

  showModalUndo = () => {
    this.setState({
      visibleUndo: true
    });
  };

  handleOKUndo = () => {
    this.setState(
      {
        visibleUndo: false
      },
      () => {
        this.socket.emit('REPLY_UNDO', {
          ID: this.state.ID,
          status: true
        });
      }
    );
  };

  handleCancelUndo = e => {
    this.setState(
      {
        visibleUndo: false
      },
      () => {
        this.socket.emit('REPLY_UNDO', {
          ID: this.state.ID,
          status: false
        });
      }
    );
  };

  showModalSurrender = () => {
    this.setState({
      visibleSurrender: true
    });
  };

  handleOKSurrender = () => {
    this.setState(
      {
        visibleSurrender: false
      },
      () => {
        this.socket.emit('SURRENDER', {
          ID: this.state.ID
        });
      }
    );
  };

  handleCancelSurrender = e => {
    this.setState({
      visibleSurrender: false
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

    const checkNull = squares.every(item => item === null);

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
                  {isPlaying ? status : 'Mời bạn tìm người chơi'}
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
                  <Button type="primary" disabled={!isPlaying || checkNull}>
                    Xin hòa
                  </Button>
                  <Button
                    type="primary"
                    disabled={!isPlaying || checkNull}
                    onClick={this.showModalSurrender}
                  >
                    Đầu hàng
                  </Button>
                  <Button
                    type="primary"
                    disabled={!isPlaying || !isDisable || checkNull}
                    onClick={this.handleUndo}
                  >
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
          content={'Xin chúc mừng, bạn đã thắng. Bạn có muốn chơi lại không?'}
          title="Kết thúc game"
          visible={this.state.visibleWin}
          onCancel={this.handleCancelWin}
          onOk={this.handleOKWin}
        />
        <Modal
          title="Kết thúc game"
          visible={this.state.visibleLost}
          onCancel={this.handleCancelLost}
          onOk={this.handleOKLost}
          content="Xin chia buồn, bạn đã thua. Bạn có muốn chơi lại?"
        />
        <Modal
          title="Quay lại bước đi"
          visible={this.state.visibleUndo}
          onCancel={this.handleCancelUndo}
          onOk={this.handleOKUndo}
          content=" Bạn có muốn đối thủ quay lại bước đi?"
        />
         <Modal
          content={'Bạn muốn đầu hàng'}
          title="Đầu hàng"
          visible={this.state.visibleSurrender}
          onCancel={this.handleCancelSurrender}
          onOk={this.handleOKSurrender}
        />
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
