import React, { Component } from "react";
import Square from "./Square";
import Piece from "./Piece";
import Rulebook from "./Rulebook";
import "./Board.css";

class Board extends Component {
    colors = ["white", "black"];
    colCoordinatesChars = ["a", "b", "c", "d", "e", "f", "g", "h"];
    defaultPieceOrdering = ["R", "N", "B", "Q", "K", "B", "N", "R"];
    selectedPiece = null;
    

    constructor(props) {
        super(props);

        this.state = {
            piecePositions: this.generateDefaultPiecePlacement(),
            selectedPiecePos: [-1, -1],
            deadPieces: [],
            isWhiteNext: true
        };
    }

    get colCoordinates() {
        return this.colCoordinatesChars.map((coord, index) => <div key={index}>{ coord.toUpperCase() }</div>);
    }

    get board() {
        let board = [];

        for(let i = 0; i < 8; i++) {
            board[i] = [];
            for(let j = 0; j < 8; j++) {
                const squareColor = this.colors[((j & 1) + (i & 1)) & 1];
                const isHighlighted = i === this.state.selectedPiecePos[0] && j === this.state.selectedPiecePos[1];
                board[i][j] = <Square 
                    key={i * 8 + j}
                    highlighted={isHighlighted} 
                    color={squareColor} 
                    onClick={() => this.handleClick(i, j)}
                    piece={this.getPieceAtPos(i, j)} />
            }
        }

        return board;
    }

    handleClick(row, col) {
        const clickedPiece = this.getPieceAtPos(row, col);
        if(clickedPiece !== null && clickedPiece !== this.selectedPiece && this.canSelect(clickedPiece)) {
            this.selectPieceAt(row, col);
        } else if(this.selectedPiece !== null && this.canMoveSelectedPieceTo(row, col)) {
            this.moveSelectedPieceTo(row, col);
        } else {
            this.unSelectPiece();
        }
    }

    canSelect(piece) {
        console.log('checking if piece can be selected');
        return !(this.state.isWhiteNext ^ piece.props.team === 'white');
    }

    canMoveSelectedPieceTo(row, col) {
        return this.canMovePiece(this.state.selectedPiecePos[0], this.state.selectedPiecePos[1], row, col);
    }

    canMovePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPieceAtPos(fromRow, fromCol);
        if((fromRow === toRow && fromCol === toCol)
            || (piece.props.notation !== 'N' && this.isMovementObstructed(fromRow, fromCol, toRow, toCol))) {
            return false;
        }

        const from = this.convertToChessCords(fromRow, fromCol),
            to = this.convertToChessCords(toRow, toCol);

        return Rulebook.isValidMove(piece.props.notation, piece.props.team, from, to);
    }

    isMovementObstructed(fromRow, fromCol, toRow, toCol) {
        console.log(`Verifying obstructions from ${fromRow},${fromCol} to ${toRow},${toCol}`);

        // TODO: Verify obstructions

        return false;      
    }

    moveSelectedPieceTo(row, col) {
        this.movePiece(this.state.selectedPiecePos[0], this.state.selectedPiecePos[1], row, col);
        this.unSelectPiece();
    }
        

    movePiece(fromRow, fromCol, toRow, toCol) {
        console.log(`moving piece from ${fromRow},${fromCol} to ${toRow},${toCol}`);
        this.setState((state) => {
            const attackedPiece = state.piecePositions[toRow][toCol];
            let newState = {
                piecePositions: state.piecePositions.map(row => row.slice()),
                isWhiteNext: !state.isWhiteNext
            };

            newState.piecePositions[toRow][toCol] = state.piecePositions[fromRow][fromCol];
            newState.piecePositions[fromRow][fromCol] = undefined;

            if(attackedPiece) {
                console.log('adding attacked piece to list of dead pieces');
                newState.deadPieces = [...state.deadPieces, attackedPiece];
            }

            return newState;            
        });
    }

    unSelectPiece() {
        if(this.selectedPiece !== null) {
            console.log('unselecting piece');
            this.selectedPiece = null;
            this.setState({
                selectedPiecePos: [-1, -1]
            });
        }
    }

    selectPieceAt(row, col) {
        const clickedPiece = this.getPieceAtPos(row, col);
        if(clickedPiece) {
            console.log('selecing piece');
            this.selectedPiece = clickedPiece;
            this.setState({
                selectedPiecePos: [row, col]
            });
        }
    }

    renderGameArea() {
        return this.board.map((row, index) => {
            return (
                <div className="row" key={index}>
                    <div className="row-coord">{8 - index}</div>
                    { row }
                </div>
            );
        });
    }

    generateDefaultPiecePlacement() {
        const pawnRow = ["P","P","P","P","P","P","P","P"];

        return [ 
            this.defaultPieceOrdering.map((n, i) => <Piece team='black' notation={n} key={i} />),
            pawnRow.map((n, i) => <Piece team='black' notation={n} key={i} />),
            [],
            [],
            [],
            [],
            pawnRow.map((n, i) => <Piece team='white' notation={n} key={i} />),
            this.defaultPieceOrdering.map((n, i) => <Piece team='white' notation={n} key={i} />)
        ]    
    } 

    getPieceAtPos(row, col) {
        if(typeof this.state === 'undefined') return null;
 
        const piece = this.state.piecePositions[row][col];

        if(typeof piece === 'undefined') {
            return null;
        }

        return piece;
    }

    convertToChessCords(row, col) {
        return `${this.colCoordinatesChars[col]}${8-row}`;
    }

    render() {
        return (
            <div className="board">
                <div className="game-area">
                    { this.renderGameArea() }
                </div>
                <div className="col-coords">
                    { this.colCoordinates }
                </div>
                <div className="meta">
                    { `${this.state.isWhiteNext ? 'White':'Black'} to move`}
                </div>
            </div>
        );
    }
}

export default Board;