import React from 'react';
import Board from '../Board/Board';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    col: -1,
                    row: -1
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            sortASC: true
        }
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const col = (i % 3) + 1;
        const row = Math.floor(i/3) + 1;

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat(
                [
                    {
                        squares: squares,
                        col: col,
                        row: row
                    }
                ]
            ),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    toggleSort() {
        this.setState({
            sortASC: !this.state.sortASC
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let historyArr;
        if (!this.state.sortASC) {
            historyArr = history.slice(0).reverse();
        }
        else {
            historyArr = history.slice(0);
        }

        const moves = historyArr.map((step, move) => {
            if (!this.state.sortASC) {
                move = historyArr.length - move;
                move--;
            }
            const desc = move ?
            'Go to move #' + move + " at " + step.row + "," + step.col:
            'Go to game start';

            let selectedMove = "";
            if (this.state.stepNumber === move && history.length > move + 1) {
                selectedMove = "selectedMove";
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={selectedMove}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner.name;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let sortButton = "&darr;";
        if (this.state.sortASC) {
            sortButton = <button onClick={() => this.toggleSort()}>&darr;</button>;
        }
        else {
            sortButton = <button onClick={() => this.toggleSort()}>&uarr;</button>;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        coordinates={winner ? winner.coordinates : null}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{sortButton} {status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

export default Game;

//====================================

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

    let winner = {
        name: "",
        coordinates: null
    };

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner.coordinates = lines[i];
            winner.name = squares[a];
            return winner;
        }
    }
    return null;
}