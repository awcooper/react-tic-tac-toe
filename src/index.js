import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chunk from 'lodash/chunk';


const NUMBER_OF_ROWS = 3;
const NUMBER_OF_COLS = 3;

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
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

  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
            { chunk(new Array(NUMBER_OF_ROWS * NUMBER_OF_COLS).fill(0),
        NUMBER_OF_ROWS)
        .map((row, i) => {
          return (
            <div className="board-row">
                		{row.map((col, j) => {
              return this.renderSquare(i * NUMBER_OF_COLS + j);
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
      historyAsc: true
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
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
        row: Math.floor(i / NUMBER_OF_ROWS) + 1,
        col: i % NUMBER_OF_COLS + 1
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  flipHistoryOrder() {
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
      const desc = step.row != null ?
        `(${step.row},${step.col})` :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (this.state.historyAsc) {
      moves.reverse()
    }

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
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
          <button onClick={() => this.flipHistoryOrder()}>flip?</button>
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
