class Rulebook {
    static colCoordinatesChars = ["a", "b", "c", "d", "e", "f", "g", "h"];
    static defaultPieceOrdering = ["R", "N", "B", "Q", "K", "B", "N", "R"];

    static isValidMove(piece, color, fromRow, fromCol, toRow, toCol, piecePositions) {
        const from = Rulebook.convertToChessCords(fromRow, fromCol),
            to = Rulebook.convertToChessCords(toRow, toCol);

        console.log(`Analyzing move of ${color} ${piece} from ${from} to ${to}`);

        if(piece !== 'N' 
            && Rulebook.isMovementObstructed(fromRow, fromCol, toRow, toCol, piecePositions)) {
            return false;
        }

        return true;
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
}

export default Rulebook;