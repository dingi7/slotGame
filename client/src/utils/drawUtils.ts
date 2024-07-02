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

export const drawLine = (
  graphics: PIXI.Graphics,
  slotHeight: number,
  windowWidth: number,
  isMobile: boolean
) => {
  graphics.clear();
  graphics.lineStyle(4, 0xff0000, 1);
  graphics.moveTo(0, slotHeight * 1.5);
  graphics.lineTo(
    windowWidth * 0.391 * (windowWidth <= 768 ? 2 : 1),
    slotHeight * 1.5
  );
  graphics.endFill();
};

export const drawWinningLines = (
  graphics: PIXI.Graphics,
  winningMatrix: boolean[][],
  slotHeight: number,
  windowWidth: number,
  isMobile: boolean
) => {
  graphics.clear();
  graphics.lineStyle(4, 0xff0000, 1);

  // Todo
  graphics.endFill();
};
