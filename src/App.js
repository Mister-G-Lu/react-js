import { useState } from "react";

function Header() {
  return (
    <header className="header">
      <h1>Tic Tac Toe</h1>
    </header>
  );
}

function Square({ value, onSquareClick, isWin }) {
  const squareStyle = {
    backgroundColor: isWin ? "green" : "white"
  };

  return (
    <button className="square" style={squareStyle} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const nextPlayerStatus = xIsNext ? (
    <span className="next-player">X</span>
  ) : (
    <span className="next-player">O</span>
  );

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = (
      <>
        {"Next player: "}
        {nextPlayerStatus}
      </>
    );
  }

  let winSquares = findWinner(squares);

  let numRows = 3;
  let numCol = 3;
  const boardRows = [];
  for (let row = 0; row < numRows; row++) {
    const squareElements = [];
    for (let col = 0; col < numCol; col++) {
      const squareIndex = row * 3 + col;
      /*  <Square value={squares[0]} onSquareClick={() => handleClick(0)} /> */
      squareElements.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWin={winSquares.includes(squareIndex)}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {squareElements}
      </div>
    );
  }

  return (
    <>
      <pre></pre>
      <div className="status">{status}</div>
      <div className="board-container">{boardRows}</div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isReversed, setIsReversed] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const toggleListOrder = () => {
    setIsReversed((prevState) => !prevState);
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (isReversed) {
    moves.reverse();
  }

  let moveDesc = "You are on move " + currentMove;

  return (
    <div className="game" class="center">
      <pre>{"\n"}</pre>
      <div className="game-board">
        <Header />
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {/* using OL is confusing and redundant (indexed by 1)*/}
        <div>{moves}</div>

        {moveDesc}
        <pre></pre>
        <button onClick={toggleListOrder}>
          {isReversed ? "Show in Original Order" : "Show in Reversed Order"}
        </button>
      </div>
      <div className="game-info">
        <pre>{"\n"}</pre>
      </div>
    </div>
  );
}

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

/*we could use a single func for hashmap but let's separate logic*/
function findWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [];
}

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  let draw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      draw = false;
    }
  }
  if (draw) {
    return "DRAW";
  }
  return null;
}
