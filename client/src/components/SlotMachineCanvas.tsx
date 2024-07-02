import * as PIXI from 'pixi.js';

import { Graphics, Stage } from '@pixi/react';

import { ColumnStateType } from '../types/slotMachineTypes';
import React from 'react';
import { SlotReel } from './SlotReel';
import { drawLine, drawWinningLines } from '../utils/drawUtils';

interface SlotMachineCanvasProps {
  columnStates: ColumnStateType[];
  positions: number[];
  showLine: boolean;
  windowWidth: number;
  isMobile: boolean;
  slotHeight: number;
  totalHeight: number;
  winningMatrix: boolean[][];
}

export const SlotMachineCanvas: React.FC<SlotMachineCanvasProps> = ({
  columnStates,
  positions,
  showLine,
  windowWidth,
  isMobile,
  slotHeight,
  totalHeight,
  winningMatrix
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
        {showLine && <Graphics draw={(g: PIXI.Graphics) => drawWinningLines(g, winningMatrix, windowWidth, slotHeight, isMobile)} />}
      </Stage>
    </div>
  );
};
