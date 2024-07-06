import * as PIXI from "pixi.js";

import { Graphics, Stage } from "@pixi/react";

import React from "react";
import { ReelStateType } from "../types/slotMachineTypes";
import SlotMachineWinText from "./SlotMachineWinText";
import { SlotReel } from "./SlotReel";
import { drawWinningLines } from "../utils/drawUtils";

interface SlotMachineCanvasProps {
  reelStates: ReelStateType[];
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
  reelStates,
  positions,
  showLine,
  windowWidth,
  isMobile,
  slotHeight,
  totalHeight,
  winningMatrix,
  tempWinning,
}) => {
  const powerPreference =
    import.meta.env.VITE_HIGH_PERFORMANCE === "TRUE"
      ? "high-performance"
      : "default";
  return (
    <div className="my-auto relative">
      <Stage
        options={{
          backgroundAlpha: 0,
          antialias: false,
          powerPreference: powerPreference,
          sharedTicker: true,
          autoStart: true,
          autoDensity: true,
        }}
        width={windowWidth * 0.391 * (isMobile ? 2 : 1)}
        height={totalHeight}
      >
        {reelStates.map((column, colIndex) => (
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
