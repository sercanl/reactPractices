import React from 'react';
import Square from '../Square/Square';

class Board extends React.Component {

    renderSquare(i) {
        return (<Square
                        key={i}
                        value={this.props.squares[i]}
                        onClick={() => this.props.onClick(i)}
                />
        );
    }

    createTheBoard() {
        let board = [];

        let counter = 0;
        for (let i = 0; i < 3; i++) {
            let children = [];
            for (let j = 0; j < 3; j++) {
                children.push(this.renderSquare(counter));
                counter++;
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