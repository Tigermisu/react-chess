class Rulebook {
    static colCoordinatesChars = ["a", "b", "c", "d", "e", "f", "g", "h"];
    static defaultPieceOrdering = ["R", "N", "B", "Q", "K", "B", "N", "R"];

    static isValidMove(piece, color, fromRow, fromCol, toRow, toCol, piecePositions) {
        if(piece !== "N" && Rulebook.isMovementObstructed(fromRow, fromCol, toRow, toCol, piecePositions)) {
            return false;
        }

        switch(piece) {
            case "P": return Rulebook.validatePawnMovement(color, fromRow, fromCol, toRow, toCol, piecePositions);
            case "R": return Rulebook.validateRookMovement(fromRow, fromCol, toRow, toCol);
            case "N": return Rulebook.validateKnightMovement(fromRow, fromCol, toRow, toCol);
            case "B": return Rulebook.validateBishopMovement(fromRow, fromCol, toRow, toCol);
            case "Q": return Rulebook.validateQueenMovement(fromRow, fromCol, toRow, toCol);
            case "K": return Rulebook.validateKingMovement(fromRow, fromCol, toRow, toCol);
            default:
                throw new Error(`Unknown piece for movement validation: ${piece}`);
        }
    }

    static isMovementObstructed(fromRow, fromCol, toRow, toCol, piecePositions) {
        let clamp = (value) => {
                return Math.max(Math.min(value, 1), -1);
            },
            currentRow = fromRow + clamp(toRow - fromRow),
            currentCol = fromCol + clamp(toCol - fromCol);
                
        while(currentRow !== toRow || currentCol !== toCol) {
            if(piecePositions[currentRow][currentCol]) {
                return true;
            }

            currentRow += clamp(toRow - currentRow);
            currentCol += clamp(toCol - currentCol);
        }    
        
        return false;
    }

    static convertToChessCords(row, col) {
        return `${Rulebook.colCoordinatesChars[col]}${8-row}`;
    }

    static isAttacked(targetRow, targetCol, attackerTeam, piecePositions) {
        return piecePositions.some((row, rowIndex) => row.some((piece, colIndex) => {
            if(piece && piece.team === attackerTeam) {                
                if(piece.notation === 'P') {
                    if(colIndex === targetCol) {
                        return false;
                    }

                    return Math.abs(targetCol - colIndex) === 1 && (targetRow - rowIndex === (attackerTeam === 'black' ? 1 : -1));
                }

                return Rulebook.isValidMove(piece.notation, attackerTeam, rowIndex, colIndex, targetRow, targetCol, piecePositions);;                
            }

            return false;
        }));
    }

    static validatePawnMovement(color, fromRow, fromCol, toRow, toCol, piecePositions) {
        const deltaRow = toRow - fromRow,
            deltaColAbs = Math.abs(toCol - fromCol),
            deltaRowAbs = Math.abs(deltaRow);

        if(deltaColAbs > 1 || deltaRowAbs > 2) {
            return false;
        }

        if((color === "black" && deltaRow <= 0) || (color === "white" && deltaRow >= 0)) {
            return false;
        }

        if(deltaColAbs === 1 && deltaRowAbs === 1 && !piecePositions[toRow][toCol]) {
            return false;
        }

        if(deltaColAbs === 0 && piecePositions[toRow][toCol]) {
            return false;
        }

        if(deltaRowAbs === 2 
            && ((color === "white" && fromRow !== 6) || (color === "black" && fromRow !== 1))) {
            return false;
        }

        if(deltaColAbs > 0 && deltaRowAbs > 1) {
            return false;
        }

        return true;
    }

    static validateRookMovement(fromRow, fromCol, toRow, toCol) {
        return fromRow === toRow || fromCol === toCol;
    }

    static validateKnightMovement(fromRow, fromCol, toRow, toCol) {
        const deltaRow = Math.abs(toRow - fromRow),
            deltaCol = Math.abs(toCol - fromCol);

        return (deltaCol === 1 && deltaRow === 2) || (deltaRow === 1 && deltaCol === 2);
    }

    static validateBishopMovement(fromRow, fromCol, toRow, toCol) {
        return Math.abs(toCol - fromCol) === Math.abs(toRow - fromRow);
    }

    static validateQueenMovement(fromRow, fromCol, toRow, toCol) {
        return fromRow === toRow || fromCol === toCol || Math.abs(toCol - fromCol) === Math.abs(toRow - fromRow);
    }

    static validateKingMovement(fromRow, fromCol, toRow, toCol) {
        const deltaRow = Math.abs(toRow - fromRow),
            deltaCol = Math.abs(toCol - fromCol);

        return deltaRow < 2 && deltaCol < 2;
    }

}

export default Rulebook;