import './style.scss'

import React from "react";
import io from "socket.io-client";
import { Spin, Button, Input } from 'antd';
import Board from '../../component/Board';
import Header from '../../component/Header'
import sortASC from "../../asset/alphabetical-order.svg";
import sortDESC from "../../asset/sort-alphabetically-down-from-z-to-a.svg";
import { connect } from 'react-redux';
import { AddItem, Reset, ModifiedHistory } from '../../action';
import * as handleFunction from '../../Helper/handleFunction';

class GameOnline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: this.props.history,
            xIsNext: true,
            indexCheck: -1,
            stepNumber: 0,
            win: false,
            moveMax: 0,
            isSort: true,
            loading: false,
            username: '',
            message: '',
            messages: []
        };
        this.socket = io('localhost:4500');

        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data);
        });

        const addMessage = data => {
            console.log(data);
            this.setState({ messages: [...this.state.messages, data] });
            console.log(this.state.messages);
        };
    }
    static getDerivedStateFromProps(props, state) {
        return {
            history: props.history
        }
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
        this.props.modifiedHistory(history);
        if (squares[i] === null) {

            squares[i] = 'X';
            this.props.onClick(squares);

            this.setState({
                xIsNext: false,
                indexCheck: i,
                stepNumber: history.length
            }, () => {
                setTimeout(() => {
                    this.handleBotPlay(i)
                }, 1000)
            })
        }
    }

    handleBotPlay = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (handleFunction.calculateWinner(this.state.indexCheck, (squares || squares[i]))) {
            if (handleFunction.checkBlock(this.state.indexCheck, (squares || squares[i]))) {
                return;
            };
        }
        this.props.modifiedHistory(history);
        let index = -1;
        while (true) {
            index = Math.floor(Math.random() * 400);
            if (squares[index] === null)
                break;
        }

        squares[index] = 'O';
        this.props.onClick(squares);

        this.setState({
            xIsNext: true,
            indexCheck: index,
            stepNumber: history.length
        });
    }

    handleClickReset = () => {
        this.props.reset();
        this.setState({
            // xIsNext: true,
            indexCheck: -1,
            stepNumber: 0,
            isSort: true,
        });
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
                id: "123"
            })
        }, 1000))
        this.socket.on('PLAY', data => {
            console.log('this', this);
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
        const current = history[this.state.stepNumber];
        const squares = current.squares;
        const i = this.state.indexCheck;
        const winner = handleFunction.calculateWinner(i, squares);
        let nonBlock = null;

        if (winner) {
            nonBlock = handleFunction.checkBlock(i, squares);
        }

        const moves = history.map((step, move) => {
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
                {this.state.loading ?
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
                                    disable={!this.state.xIsNext || this.props.disable}
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
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    history: state.game.history,
    account: state.login.account
})

const mapDispatchToProps = (dispatch) => ({
    onClick: (data) => dispatch(AddItem(data)),
    reset: () => dispatch(Reset()),
    modifiedHistory: (history) => dispatch(ModifiedHistory(history))
});

export default connect(mapStateToProps, mapDispatchToProps)(GameOnline)