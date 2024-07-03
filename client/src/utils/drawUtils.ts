import * as PIXI from "pixi.js";

import { BlurFilter } from "@pixi/filter-blur";

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

const drawHorizontalLine = (graphics: PIXI.Graphics, x1: number, y: number, x2: number) => {
  graphics.moveTo(x1, y);
  graphics.lineTo(x2, y);
};

export const drawWinningLines = (
  graphics: PIXI.Graphics,
  slotHeight: number,
  windowWidth: number,
  isMobile: boolean,
  winningMatrix: boolean[][]
) => {
  console.log(windowWidth);
  graphics.clear();
  graphics.lineStyle(LINE_WIDTH, LINE_COLOR, LINE_ALPHA);

  const firstColX2 = windowWidth / 3.475;
  const secondColX1 = windowWidth / 2.82;
  const secondColX2 = (windowWidth / 3.115) * 2;
  const thirdColX1 = windowWidth / 0.6;
  const thirdColX2 = (windowWidth / 2.805) * 2;

  // Draw lines based on the winningMatrix
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (winningMatrix[row][col]) {
        const y = slotHeight * (row + 0.5);
        
        switch (col) {
          case 0:
            drawHorizontalLine(graphics, 0, y, firstColX2);
            break;
          case 1:
            drawHorizontalLine(graphics, secondColX1, y, secondColX2);
            break;
          case 2:
            drawHorizontalLine(graphics, thirdColX1, y, thirdColX2);
            break;
        }
      }
    }
  }

  graphics.endFill();
};