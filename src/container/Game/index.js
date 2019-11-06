import './style.scss';

import React from 'react';
import {Button, Avatar } from 'antd';
import Board from '../../component/Board/index';
import sortASC from '../../asset/alphabetical-order.svg';
import sortDESC from '../../asset/sort-alphabetically-down-from-z-to-a.svg';
import { connect } from 'react-redux';
import { AddItem, Reset, ModifiedHistory } from '../../action/index';
import * as handleFunction from '../../Helper/handleFunction';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: this.props.history,
      xIsNext: true,
      indexCheck: -1,
      stepNumber: 0,
      win: false,
      moveMax: 0,
      isSort: true
    };
  }
  static getDerivedStateFromProps(props, state) {
    return {
      history: props.history
    };
  }
  handleClick = i => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (
      handleFunction.calculateWinner(
        this.state.indexCheck,
        squares || squares[i]
      )
    ) {
      if (
        handleFunction.checkBlock(this.state.indexCheck, squares || squares[i])
      ) {
        return;
      }
    }
    this.props.modifiedHistory(history);
    if (squares[i] === null) {
      squares[i] = 'X';
      this.props.onClick(squares);

      this.setState(
        {
          xIsNext: false,
          indexCheck: i,
          stepNumber: history.length
        },
        () => {
          setTimeout(() => {
            this.handleBotPlay(i);
          }, 1000);
        }
      );
    }
  };

  handleBotPlay = i => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (
      handleFunction.calculateWinner(
        this.state.indexCheck,
        squares || squares[i]
      )
    ) {
      if (
        handleFunction.checkBlock(this.state.indexCheck, squares || squares[i])
      ) {
        return;
      }
    }
    this.props.modifiedHistory(history);
    let index = -1;
    while (true) {
      index = Math.floor(Math.random() * 400);
      if (squares[index] === null) break;
    }

    squares[index] = 'O';
    this.props.onClick(squares);

    this.setState({
      xIsNext: true,
      indexCheck: index,
      stepNumber: history.length
    });
  };

  handleClickReset = () => {
    this.props.reset();
    this.setState({
      indexCheck: -1,
      stepNumber: 0,
      isSort: true
    });
    const cls = document.getElementsByClassName('square');
    Array.prototype.forEach.call(cls, item => item.removeAttribute('style'));
  };

  jumpTo = step => {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
    const cls = document.getElementsByClassName('square');
    Array.prototype.forEach.call(cls, item => item.removeAttribute('style'));
  };

  handleSort = () => {
    this.setState({
      isSort: !this.state.isSort
    });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const i = this.state.indexCheck;
    const winner = handleFunction.calculateWinner(i, squares);

    let user = {};
    if (this.props.account) {
      user = this.props.account.user;
    }


    let nonBlock = null;

    if (winner) {
      nonBlock = handleFunction.checkBlock(i, squares);
    }
    const moves = history.map((step, move) => {
      const desc = move
        ? 'Bước ' + move + ' ' + new Date().toLocaleTimeString()
        : 'Bước bắt đầu chơi';
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? 'active' : ''}
          >
            {desc}
          </button>
        </li>
      );
    });
    const movesSort = this.state.isSort ? moves : moves.reverse();
    let status;
    if (nonBlock) {
      status = squares[i] === 'X' ? 'Bạn đã thắng' : 'Máy đã thắng';
      handleFunction.styleWinner(i, squares);
    } else {
      status = this.state.xIsNext ? 'Tới lượt bạn' : 'Tới lượt máy';
    }

    return (
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
                  onClick={this.handleClickReset}
                >
                  Chơi lại
                </Button>
              </div>
            </div>
          </div>
          <div className="game-board">
            {/* <div className="status" style={{ color: '#ffff00' }}>
              {status}
            </div>
            <div className="play-again">
              <button onClick={() => this.handleClickReset()}>Chơi lại</button>
            </div> */}
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              indexCheck={i}
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
    );
  }
}

const mapStateToProps = state => ({
  history: state.game.history,
  account: state.getInfomation.account
});

const mapDispatchToProps = dispatch => ({
  onClick: data => dispatch(AddItem(data)),
  reset: () => dispatch(Reset()),
  modifiedHistory: history => dispatch(ModifiedHistory(history))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
