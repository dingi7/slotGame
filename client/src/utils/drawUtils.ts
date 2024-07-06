import * as PIXI from "pixi.js";

// export const drawRect = (graphics: PIXI.Graphics, windowWidth: number, slotHeight: number, isMobile: boolean) => {
//   graphics.clear();
//   graphics.lineStyle(5, 0x966304, 1);
//   //const fillColor = 0x08043c;
//   //graphics.beginFill(fillColor, 1);
//   graphics.drawRoundedRect(
//     0,
//     slotHeight,
//     windowWidth * 0.11 * (isMobile ? 2 : 1),
//     slotHeight * 3,
//     5
//   );
//   graphics.endFill();
// };

export const drawRectBackground = (
  graphics: PIXI.Graphics,
  windowWidth: number,
  slotHeight: number,
  isMobile: boolean
) => {
  graphics.clear();
  const fillColor = 0x08043c;
  graphics.beginFill(fillColor, 0.55);
  graphics.drawRoundedRect(
    0,
    slotHeight,
    windowWidth * 0.11 * (isMobile ? 2 : 1),
    slotHeight * 3,
    5
  );
  graphics.endFill();
};

export const drawRectBorder = (
  graphics: PIXI.Graphics,
  windowWidth: number,
  slotHeight: number,
  isMobile: boolean
) => {
  graphics.clear();
  graphics.lineStyle(5, 0x966304, 1);
  graphics.drawRoundedRect(
    0,
    slotHeight,
    windowWidth * 0.11 * (isMobile ? 2 : 1),
    slotHeight * 3,
    5
  );
  graphics.endFill();
};

const LINE_WIDTH = 4;
const LINE_COLOR = 0xff0000;
const LINE_ALPHA = 1;

// Function to draw a single horizontal line
const drawHorizontalLine = (
  graphics: PIXI.Graphics,
  x1: number,
  y: number,
  x2: number
) => {
  graphics.moveTo(x1, y);
  graphics.lineTo(x2, y);
};

// Function to draw a single vertical line
const drawVerticalLine = (
  graphics: PIXI.Graphics,
  x: number,
  y1: number,
  y2: number
) => {
  graphics.moveTo(x, y1);
  graphics.lineTo(x, y2);
};

// Function to draw a single diagonal line
const drawDiagonalLine = (
  graphics: PIXI.Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  graphics.moveTo(x1, y1);
  graphics.lineTo(x2, y2);
};

export const drawWinningLines = (
  graphics: PIXI.Graphics,
  slotHeight: number,
  windowWidth: number,
  winningMatrix: boolean[][]
) => {
  graphics.clear();
  graphics.lineStyle(LINE_WIDTH, LINE_COLOR, LINE_ALPHA);

  const checkDiagonalWin = (matrix: boolean[][]): boolean[] => {
    const diagonal1 = matrix[0][0] && matrix[1][1] && matrix[2][2];
    const diagonal2 = matrix[0][2] && matrix[1][1] && matrix[2][0];
    return [diagonal1, diagonal2];
  };

  const [diagonal1, diagonal2] = checkDiagonalWin(winningMatrix);

  if (diagonal1) {
    drawDiagonalLine(graphics, 0, 0,  windowWidth * 0.391, slotHeight * 3);
  }

  if (diagonal2) {
    drawDiagonalLine(graphics, 0, slotHeight * 3, windowWidth * 0.391, 0);
  }

  const checkVerticalWin = (matrix: boolean[][]): boolean[] => {
    return matrix[0].map(
      (_, colIndex) => matrix[0][colIndex] && matrix[1][colIndex] && matrix[2][colIndex]
    );
  };

  const verticalWins = checkVerticalWin(winningMatrix);

  for (let col = 0; col < 3; col++) {
    if (verticalWins[col]) {
      const x = windowWidth / 3 * (col + 0.5);
      const textX = (x + slotHeight * col) / 3.05;
      drawVerticalLine(graphics, textX, 0, slotHeight * 3);
    }
  }

  for (let row = 0; row < 3; row++) {
    const horizontalWin = winningMatrix[row].every((cell) => cell);
    if (horizontalWin) {
      const y = slotHeight * (row + 0.5);
      drawHorizontalLine(graphics, 0, y, windowWidth - 0);
    }
  }

  graphics.endFill();
};