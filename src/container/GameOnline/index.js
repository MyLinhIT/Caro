import './style.scss'

import React from "react";
import io from "socket.io-client";
import { Spin, Button, Input } from 'antd';
import Board from '../../component/Board';
import Header from '../../component/Header'
import sortASC from "../../asset/alphabetical-order.svg";
import sortDESC from "../../asset/sort-alphabetically-down-from-z-to-a.svg";
import { connect } from 'react-redux';
import * as handleFunction from '../../Helper/handleFunction';

class GameOnline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(400).fill(null)
            }],
            xIsNext: true,
            indexCheck: -1,
            stepNumber: 0,
            stepNumberOnline: 0,
            win: false,
            moveMax: 0,
            isSort: true,
            loading: false,
            username: '',
            message: '',
            messages: []
        };

    }

    componentWillMount() {
        this.socket = io('localhost:4500');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        this.socket.on("PLAY", (data) => {
            handleBotPlay(data);
        })

        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] });
        };

        const handleBotPlay = data => {
            this.setState({
                history: data.history,
                stepNumber: data.stepNumber
            });
        };
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (handleFunction.calculateWinner(this.state.indexCheck, (squares || squares[i]))) {
            if (handleFunction.checkBlock(this.state.indexCheck, (squares || squares[i]))) {
                return;
            };
        }

        if (squares[i] === null) {
            squares[i] = 'X';

            this.setState({
                history: history.concat([{
                    squares: squares
                }]),
                xIsNext: false,
                indexCheck: i,
                stepNumber: history.length
            }, () => {
                setTimeout(() => {
                    this.socket.emit("PLAY", { history: this.state.history, stepNumber: this.state.stepNumber })
                }, 100)
            })
        }
    }

    handleClickReset = () => {
        this.setState({
            indexCheck: -1,
            stepNumber: 0,
            isSort: true,
            history: [{
                squares: Array(400).fill(null)
            }],
        }, () => {
            setTimeout(() => {
                this.socket.emit("PLAY", { history: this.state.history, stepNumber: this.state.stepNumber })
            }, 100)
        })

        const cls = document.getElementsByClassName('square');
        Array.prototype.forEach.call(cls, (item) => item.removeAttribute('style'));
    }

    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
        const cls = document.getElementsByClassName('square');
        Array.prototype.forEach.call(cls, (item) => item.removeAttribute('style'));
    }

    handleSort = () => {
        this.setState({
            isSort: !this.state.isSort
        })
    }

    findPlayer = () => {
        this.setState({
            loading: true,
        }, () => setTimeout(() => {
            this.socket.emit('FIND_PLAYER', {
                id: this.props.account.user._id
            })
        }, 1000))
        this.socket.on('START', () => {
            this.setState({ loading: false });
        })
    }

    sendMessage = e => {
        e.preventDefault();
        this.socket.emit('SEND_MESSAGE', {
            author: this.props.account.user.displayName,
            message: this.state.message
        })
        this.setState({ message: '' });

    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares;
        const i = this.state.indexCheck;
        const winner = handleFunction.calculateWinner(i, squares);

        let nonBlock = null;

        if (winner) {
            nonBlock = handleFunction.checkBlock(i, squares);
        }

        const moves = squares.map((step, move) => {
            const desc = move ?
                'Bước ' + move + ' ' + new Date().toLocaleTimeString() :
                'Bước bắt đầu chơi';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? "active" : ""}>{desc}</button>
                </li>
            );
        });
        const movesSort = this.state.isSort ? moves : moves.reverse();

        let status;

        if (nonBlock) {
            status = (squares[i] === 'X' ? "Bạn đã thắng" : "Máy đã thắng");
            handleFunction.styleWinner(i, squares);
        } else {
            status = (this.state.xIsNext ? 'Tới lượt bạn' : 'Tới lượt máy');
        }

        return (
            <div>
                <Header />
                <Button type="primary" onClick={this.findPlayer} icon="redo" hidden={this.state.loading}>
                    Tìm người chơi
                          </Button>
                {
                    this.state.loading ?
                        <Spin tip="Đang tìm người chơi..." size="large" style={{ color: "fff" }} >
                        </Spin> :
                        <div className="game">
                            <div className="game-body">
                                <div className="game-chat">
                                    <div className="title">
                                        <span style={{ color: '#ffff00' }}>Nhắn tin với người chơi</span>
                                    </div>
                                    <div className="content">
                                        <div className="group-message">
                                            {this.state.messages.map(message => {
                                                return (
                                                    <div>{message.author}: {message.message}</div>
                                                )
                                            })}
                                        </div>
                                        <div className="group-button">
                                            <Input placeholder="Nhập nội dung tin nhắn..."
                                                value={this.state.message}
                                                onChange={ev => this.setState({ message: ev.target.value })}
                                                onPressEnter={this.sendMessage} />
                                            <Button type="primary" onClick={this.sendMessage}>Gửi</Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="game-board">
                                    <div className="status" style={{ color: '#ffff00' }}>{status}</div>
                                    <div className="play-again" >
                                        <button onClick={() => this.handleClickReset()}>
                                            Chơi lại
                                </button>
                                    </div>
                                    <Board
                                        squares={current.squares}
                                        onClick={(i) => this.handleClick(i)}
                                    // disable={!this.state.xIsNext || this.props.disable}
                                    />
                                </div>
                                <div className="game-history">
                                    <div className="sort-icon">
                                        <span style={{ color: '#ffff00' }}>Lịch sử bước đi</span>
                                        <button className="icon" onClick={() => this.handleSort()}>
                                            <img src={this.state.isSort ? sortASC : sortDESC} alt=""></img>
                                        </button>
                                    </div>
                                    <div className="game-info">
                                        <div className="move">
                                            <ol>{movesSort}</ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    account: state.login.account
})

export default connect(mapStateToProps)(GameOnline)