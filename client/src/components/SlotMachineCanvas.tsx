import * as PIXI from "pixi.js";

import { Graphics, Stage, Text } from "@pixi/react";
import React, { useEffect, useState } from "react";
import { drawWinningLines, getLinePosition } from "../utils/drawUtils";

import { ReelStateType } from "../types/slotMachineTypes";
import { SlotReel } from "./SlotReel";
import { TextStyle } from "@pixi/text";

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
  const [linePossition, setLinePossition] = useState<
    [lineX: number, lineY: number] | undefined
  >();

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
          <Text
            text={tempWinning.toString()}
            x={linePossition?.[0]}
            y={linePossition?.[1]}
            style={
              new TextStyle({
                align: "left",
                fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                fontSize: 70,
                fontWeight: "400",
                fill: ["#ffffff", "#F8DE22"], // gradient
                stroke: "black",
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: "#ccced2",
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
              })
            }
          />
        )}
      </Stage>
    </div>
  );
};
