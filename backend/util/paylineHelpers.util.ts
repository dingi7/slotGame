import { Slot3x3 } from '../operations/slotMachine/payouts.model';

export function updateWinningMatrix(winningLineIndexs: number[]): boolean[][] {
    let winningMatrix: boolean[][] = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
    ];
    winningLineIndexs.forEach((winningLineIndex) => {
        if (winningLineIndex < 3) {
            // Mark the winning row
            winningMatrix[winningLineIndex] = [true, true, true];
        } else if (winningLineIndex < 6) {
            // Mark the winning column
            const columnIndex = winningLineIndex - 3;
            winningMatrix[0][columnIndex] = true;
            winningMatrix[1][columnIndex] = true;
            winningMatrix[2][columnIndex] = true;
        } else if (winningLineIndex === 6) {
            // Mark the diagonal from top-left to bottom-right
            winningMatrix[0][0] = true;
            winningMatrix[1][1] = true;
            winningMatrix[2][2] = true;
        } else if (winningLineIndex === 7) {
            // Mark the diagonal from bottom-left to top-right
            winningMatrix[0][2] = true;
            winningMatrix[1][1] = true;
            winningMatrix[2][0] = true;
        }
    });
    return winningMatrix;
}

export function createLines(result: Slot3x3): string[] {
    return [
        result.row1.join(''), // row 1
        result.row2.join(''), // row 2
        result.row3.join(''), // row 3
        result.row1[0] + result.row2[0] + result.row3[0], // column 1
        result.row1[1] + result.row2[1] + result.row3[1], // column 2
        result.row1[2] + result.row2[2] + result.row3[2], // column 3
        result.row1[0] + result.row2[1] + result.row3[2], // diagonal top-left to bottom-right
        result.row1[2] + result.row2[1] + result.row3[0], // diagonal bottom-left to top-right
    ];
}
