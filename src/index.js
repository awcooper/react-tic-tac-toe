import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chunk from 'lodash/chunk';


const NUMBER_OF_ROWS = 3;
const NUMBER_OF_COLS = 3;

class Square extends React.Component {

  render() {
    return (
      <button className="square" style={{
        background: this.props.color
      }}  onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}


class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  renderSquare(i, isWinner) {
    const squareColor = isWinner ? "red" : "white"
    return (
      <Square
      value={this.props.squares[i]}
      color={squareColor}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.props.squares);
    const winnerSquares = winner ? winner[1] : [];
    var index;
    return (
      <div>
            { chunk(new Array(NUMBER_OF_ROWS * NUMBER_OF_COLS).fill(0),
        NUMBER_OF_ROWS)
        .map((row, i) => {
          return (
            <div className="board-row">
                		{row.map((col, j) => {
              index = i * NUMBER_OF_COLS + j;
              return this.renderSquare(index, winnerSquares.includes(index));
            })}
            </div>
          )
        })
      }
        </div>

    )
  }
}


class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null
      }],
      xIsNext: true,
      stepNumber: 0,
      historyAsc: true,
      activeIndex: null
    };
  }

  jumpTo(step) {
     this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      activeIndex: step
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: Math.floor(i / NUMBER_OF_ROWS),
        col: i % NUMBER_OF_COLS
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      activeIndex: null
    });
  }

  toggleHistoryOrder() {
    this.setState({
      historyAsc: !this.state.historyAsc
    })
    this.render()
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const font = this.state.activeIndex === move ? "bold" : ""
      const desc = step.row != null ?
        `(${step.row},${step.col})` :
        'Go to game start';
      return (
        <li>
          <button style={{
          fontWeight: font
        }} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (this.state.historyAsc) {
      moves.reverse()
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner[0];
    } else if (history[NUMBER_OF_COLS * NUMBER_OF_ROWS]) {
      status = "It's a Draw!!";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
      squares={current.squares}
      onClick={(i) => this.handleClick(i)}
      />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleHistoryOrder()}>flip?</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
