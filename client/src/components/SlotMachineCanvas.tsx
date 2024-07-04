import * as PIXI from "pixi.js";

import { Graphics, Stage, Text } from "@pixi/react";
import React, { useEffect, useState } from "react";
import { drawWinningLines, getLinePosition } from "../utils/drawUtils";

import { ReelStateType } from "../types/slotMachineTypes";
import { SlotReel } from "./SlotReel";
import { TextStyle } from "@pixi/text";
import SlotMachineWinText from "./SlotMachineWinText";

interface SlotMachineCanvasProps {
  columnStates: ReelStateType[];
  positions: number[];
  showLine: boolean;
  windowWidth: number;
  isMobile: boolean;
  slotHeight: number;
  totalHeight: number;
  winningMatrix: boolean[][];
  hasHandledWin: boolean;
  tempWinning: number;
}

export const SlotMachineCanvas: React.FC<SlotMachineCanvasProps> = ({
  columnStates,
  positions,
  showLine,
  windowWidth,
  isMobile,
  slotHeight,
  totalHeight,
  winningMatrix,
  hasHandledWin,
  tempWinning,
}) => {
  return (
    <div className="my-auto relative">
      <Stage
        options={{ backgroundAlpha: 0 }}
        width={windowWidth * 0.391 * (isMobile ? 2 : 1)}
        height={totalHeight}
      >
        {columnStates.map((column, colIndex) => (
          <SlotReel
            key={colIndex}
            column={column}
            colIndex={colIndex}
            slotHeight={slotHeight}
            windowWidth={windowWidth}
            isMobile={isMobile}
            positions={positions}
            totalHeight={totalHeight}
          />
        ))}
        {showLine && (
          <Graphics
            draw={(g: PIXI.Graphics) =>
              drawWinningLines(
                g,
                slotHeight,
                windowWidth * (isMobile ? 2 : 1),
                isMobile,
                winningMatrix
              )
            }
          />
        )}
        {showLine && (
          <SlotMachineWinText
            tempWinning={tempWinning}
            slotHeight={slotHeight}
            windowWidth={windowWidth}
            isMobile={isMobile}
            winningMatrix={winningMatrix}
          />
        )}
      </Stage>
    </div>
  );
};
