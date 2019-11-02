import React from 'react';
import './style.scss';
import Board from '../../component/Board/index';
import * as Type from "../../contant/index";
import sortASC from "../../asset/alphabetical-order.svg";
import sortDESC from "../../asset/sort-alphabetically-down-from-z-to-a.svg";
import { connect } from 'react-redux';
import { AddItem, Reset, ModifiedHistory } from '../../action/index';

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
      isSort: true,
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
    if (calculateWinner(this.state.indexCheck, (squares || squares[i]))) {
      if (checkBlock(this.state.indexCheck, (squares || squares[i]))) {
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
    if (calculateWinner(this.state.indexCheck, (squares || squares[i]))) {
      if (checkBlock(this.state.indexCheck, (squares || squares[i]))) {
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

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const i = this.state.indexCheck;
    const winner = calculateWinner(i, squares);
    let nonBlock = null;

    if (winner) {
      nonBlock = checkBlock(i, squares);
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
      styleWinner(i, squares);
    } else {
      status = (this.state.xIsNext ? 'Tới lượt bạn' : 'Tới lượt máy');
    }

    return (
      <div className="game">
        <div className="game-body">
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
              disable={!this.state.xIsNext}
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


const mapStateToProps = (state) => ({
  history: state.game.history
})

const mapDispatchToProps = (dispatch) => ({
  onClick: (data) => dispatch(AddItem(data)),
  reset: () => dispatch(Reset()),
  modifiedHistory: (history) => dispatch(ModifiedHistory(history))
});

export default connect(mapStateToProps, mapDispatchToProps)(Game)

function calculateDESC(i, squares, type) {
  let number = 1;
  if (squares[i] === null) {
    return null;
  }

  for (let index = i, count = 1; count < 5; count++ , index += type) {
    if (squares[i] !== squares[index + type])
      return null;
    else {
      number++;
    }

  }
  return number === 5 ? squares[i] : null;
}

function calculateASC(i, squares, type) {
  let number = 1;
  if (squares[i] === null) {
    return null;
  }
  for (let index = i, count = 1; count < 5; count++ , index -= type) {
    if (squares[i] !== squares[index - type])
      return null;
    else
      number++;
  }

  return number === 5 ? squares[i] : null;
}

function calculateBetween(i, squares, type) {
  let number = 1;
  /*eslint no-mixed-operators: "off"*/

  if ((squares[i] === null) || (squares[i] !== squares[i - type]) && (squares[i] !== squares[i + type])) {
    return null;
  }
  let min, max = null;
  for (let index = i + type, count = 1; count < 5; count++ , index += type) {
    if (squares[i] === squares[index]) {
      max = index;
      number++;
    }
  }
  for (let index = i - type, count = 1; count < 5; count++ , index -= type) {
    if (index >= 0 && squares[i] === squares[index]) {
      min = index;
      number++;
    }
    if (index < 0) {
      break;
    }
  }

  for (min; min <= max; min += type) {
    if (squares[min] === null || squares[min] !== squares[i])
      return null;
  }

  return number >= 5 ? squares[i] : null;
}

function isBlock(i, squares, type) {
  let min, max = null;
  for (let index = type; index < 5 * type; index += type) {
    if (squares[i + index] !== null && squares[i] !== squares[index + i]) {
      max = index + i;
    }
  }
  for (let index = type, count = 0; count < 5; count++ , index -= type) {
    if (squares[i - index] !== null && squares[i] !== squares[i - index])
      min = i - index;
  }
  return min && max ? null : squares[i];
}

function checkBlock(i, squares) {
  const type = checkType(i, squares);
  return isBlock(i, squares, type);
}

function checkType(i, squares) {
  if (squares[i] === squares[i + Type.ROW] || squares[i] === squares[i - Type.ROW]) {
    return Type.ROW;
  }
  if (squares[i] === squares[i + Type.COLUMN] || squares[i] === squares[i - Type.COLUMN]) {
    return Type.COLUMN;
  }
  if (squares[i] === squares[i + Type.PRIMARY_DIAGONAL] || squares[i] === squares[i - Type.PRIMARY_DIAGONAL]) {
    return Type.PRIMARY_DIAGONAL;
  }
  if (squares[i] === squares[i + Type.SECONDARY_DIAGONAL] || squares[i] === squares[i - Type.SECONDARY_DIAGONAL]) {
    return Type.SECONDARY_DIAGONAL;
  }
  return null;
}

function calculateWinner(i, squares) {
  if (squares[i] === squares[i + Type.ROW]) {
    return calculateDESC(i, squares, Type.ROW) || calculateBetween(i, squares, Type.ROW)
  }
  else if (squares[i] === squares[i - Type.ROW]) {
    return calculateASC(i, squares, Type.ROW) || calculateBetween(i, squares, Type.ROW);
  }
  if (squares[i] === squares[i + Type.COLUMN]) {
    return calculateDESC(i, squares, Type.COLUMN) || calculateBetween(i, squares, Type.COLUMN)
  }
  else if (squares[i] === squares[i - Type.COLUMN]) {
    return calculateASC(i, squares, Type.COLUMN) || calculateBetween(i, squares, Type.COLUMN)
  }
  if (squares[i] === squares[i + Type.PRIMARY_DIAGONAL]) {
    return calculateDESC(i, squares, Type.PRIMARY_DIAGONAL) || calculateBetween(i, squares, Type.PRIMARY_DIAGONAL)
  }
  else if (squares[i] === squares[i - Type.PRIMARY_DIAGONAL]) {
    return calculateASC(i, squares, Type.PRIMARY_DIAGONAL) || calculateBetween(i, squares, Type.PRIMARY_DIAGONAL)
  }
  if (squares[i] === squares[i + Type.SECONDARY_DIAGONAL]) {
    return calculateDESC(i, squares, Type.SECONDARY_DIAGONAL) || calculateBetween(i, squares, Type.SECONDARY_DIAGONAL)
  }
  else if (squares[i] === squares[i - Type.SECONDARY_DIAGONAL]) {
    return calculateASC(i, squares, Type.SECONDARY_DIAGONAL) || calculateBetween(i, squares, Type.SECONDARY_DIAGONAL)
  }
  return null;
}

function styleWinner(i, squares) {
  const type = checkType(i, squares);
  for (let index = i, count = 0; count < 5; count++ , index += type) {
    if (squares[index] !== null) {
      document.getElementById(index).style.color = "yellow";
    }
  }
  for (let index = i, count = 0; count < 5; count++ , index -= type) {
    if (index >= 0 && squares[index] !== null) {
      document.getElementById(index).style.color = "yellow";
    }
    if (index < 0) {
      break;
    }
  }
}