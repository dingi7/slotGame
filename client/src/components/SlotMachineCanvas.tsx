import * as PIXI from "pixi.js";

import { Graphics, Stage, Text } from "@pixi/react";
import React, { useEffect, useState } from "react";
import { drawWinningLines, getLinePosition } from "../utils/drawUtils";

import { ReelStateType } from "../types/slotMachineTypes";
import { SlotReel } from "./SlotReel";

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
  tempWinning: number
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
  tempWinning
}) => {
  const [linePossition, setLinePossition] =
    useState<[lineX: number, lineY: number]>();

  useEffect(() => {
    if (hasHandledWin) {
      return;
    }
    const result = getLinePosition(
      winningMatrix,
      slotHeight,
      windowWidth,
      isMobile
    );
    console.log(result);

    console.log(slotHeight * 1.85);
    console.log(slotHeight / 2);

    setLinePossition(
      getLinePosition(winningMatrix, slotHeight, windowWidth, isMobile)
    );
  }, [hasHandledWin]);
  return (
    <div className="my-auto relative">
      <Stage
        options={{ backgroundAlpha: 0 }}
        width={windowWidth * 0.391 * (isMobile ? 2 : 1)}
        height={totalHeight}
        className="bg-white"
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
                windowWidth * 0.391,
                isMobile,
                winningMatrix
              )
            }
          />
        )}
        {!hasHandledWin && (
          <Text text={tempWinning} x={linePossition?.[0]} y={linePossition?.[1]} />
        )}
      </Stage>
    </div>
  );
};
