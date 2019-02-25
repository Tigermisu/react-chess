import React, { Component } from 'react';
import './Piece.css';

class Piece extends Component {
    renderPiece() {
        return `${this.props.notation}`;
    }

    render() {
        const classString = `piece ${this.props.team}`;
        return (
            <div className={classString}>{ this.renderPiece() }</div>
        );
    }
}

export default Piece;