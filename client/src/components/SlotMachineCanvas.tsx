import React from 'react';
import { Stage, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { drawLine } from '../utils/drawUtils';
import { ColumnStateType } from '../types/slotMachineTypes';
import { SlotReel } from './SlotReel';

interface SlotMachineCanvasProps {
  columnStates: ColumnStateType[];
  positions: number[];
  showLine: boolean;
  windowWidth: number;
  isMobile: boolean;
  slotHeight: number;
  totalHeight: number;
}

export const SlotMachineCanvas: React.FC<SlotMachineCanvasProps> = ({
  columnStates,
  positions,
  showLine,
  windowWidth,
  isMobile,
  slotHeight,
  totalHeight,
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
        {showLine && <Graphics draw={(g: PIXI.Graphics) => drawLine(g, slotHeight, windowWidth, isMobile)} />}
      </Stage>
    </div>
  );
};
