import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={"square " + props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        className={this.props.line.includes(i) ? "line" : ""}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  // I feel... it's harder to understand.
  render() {
    return (
      <div>
        {[0, 1, 2].map(row => (
          <div className="board-row">
            {[0, 1, 2].map(col => this.renderSquare(3 * row + col))}
          </div>
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), pos: null }],
      stepNumber: 0,
      next: "X",
      reverse: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.next;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          pos: i
        }
      ]),
      stepNumber: history.length,
      next: this.state.next === "X" ? "O" : "X"
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      next: step % 2 === 0 ? "X" : "O"
    });
  }
  // 4. Add a toggle button that lets you sort the moves in either ascending or descending order.
  reverseList() {
    this.setState({
      reverse: !this.state.reverse
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, line } = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      // 2. Bold the currently selected item in the move list.
      const bold = move === this.state.stepNumber ? { fontWeight: "bold" } : {};
      const col = step.pos % 3;
      const row = Math.floor(step.pos / 3);
      // 1. Display the location for each move in the format (col, row) in the move history list.
      const desc = move
        ? `Go to move #${move} (${col}, ${row})`
        : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={bold}>
            {desc}
          </button>
        </li>
      );
    });
    const status = winner
      ? `Winner: ${winner}`
      : `Next player: ${this.state.next}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            // 5. When someone wins, highlight the three squares that caused the win.
            line={line}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverseList()}>Reverse List</button>
          <ol>{this.state.reverse ? moves.slice().reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: [] };
}
