import React from 'react';
import Square from '../Square/Square';

class Board extends React.Component {

    renderSquare(i, winnerSquare) {
        return (<Square
                        key={i}
                        value={this.props.squares[i]}
                        onClick={() => this.props.onClick(i)}
                        winnerSquare={winnerSquare}
                />
        );
    }

    isWinnerSquare(arrayPos) {
        const coordinates = this.props.coordinates;
        if (!coordinates) {
            return false;
        }
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i] === arrayPos) {
                return true;
            }
        }
        return false;
    }

    createTheBoard() {
        let board = [];

        let arrayPos = 0;
        for (let i = 0; i < 3; i++) {
            let children = [];
            for (let j = 0; j < 3; j++) {
                children.push(this.renderSquare(arrayPos, this.isWinnerSquare(arrayPos)));
                arrayPos++;
            }
            board.push(<div className="board-row" key={i}>{children}</div>);
        }

        return board;
    }

    render() {

        return (
            <div>
                {this.createTheBoard()}
            </div>
        );
    }
}

export default Board;