import React from 'react';

class Square extends React.Component {

    render() {
        let squareClassName = "square";
        if (this.props.winnerSquare) {
            squareClassName += " winnerSquare";
        }
        return (
            <button className={squareClassName} onClick={
                () => this.props.onClick()
            }>
                {this.props.value}
            </button>
        );
    }
}

export default Square;