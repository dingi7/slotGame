import * as PIXI from "pixi.js";

import { Asset, ReelStateType } from "../types/slotMachineTypes";
import { Container, Graphics, Sprite } from "@pixi/react";
import { drawRectBackground, drawRectBorder } from "../utils/drawUtils";

import React from "react";

interface SlotColumnProps {
  column: ReelStateType;
  colIndex: number;
  slotHeight: number;
  windowWidth: number;
  isMobile: boolean;
  positions: number[];
  totalHeight: number;
}

export const SlotReel: React.FC<SlotColumnProps> = ({
  column,
  colIndex,
  slotHeight,
  windowWidth,
  isMobile,
  positions,
  totalHeight,
}) => {
  return (
    <Container
      x={
        (colIndex !== 0 ? colIndex : 0.01) *
        windowWidth *
        0.14 *
        (isMobile ? 2 : 1)
      }
      y={-slotHeight}
      key={colIndex}
    >
      <Graphics
        //@ts-ignore
        draw={(g: PIXI.Graphics) =>
          drawRectBackground(g, windowWidth, slotHeight, isMobile)
        }
      />

      <Graphics
        //@ts-ignore
        draw={(g: PIXI.Graphics) =>
          drawRectBorder(g, windowWidth, slotHeight, isMobile)
        }
      />
      {column.assets.slice(0, 4).map((asset: Asset, rowIndex: number) => (
        <>
          {/* Reels border */}
          {/* {rowIndex > 0 && rowIndex < 3 && (
            <Graphics
              draw={(g: PIXI.Graphics) => {
                g.clear();
                g.beginFill("black");
                g.drawRect(
                  isMobile ? windowWidth * 0.01 : windowWidth * 0.00095,
                  (positions[colIndex] +
                    rowIndex * slotHeight +
                    slotHeight + 4
                    ) %
                    (totalHeight * 2),
                  windowWidth * 0.1 * (isMobile ? 2 : 1.07),
                  2
                );

                g.endFill();
              }}
            />
          )} */}
          <Sprite
            key={rowIndex}
            image={asset.image}
            y={
              (positions[colIndex] + rowIndex * slotHeight) % (totalHeight * 2)
            }
            x={isMobile ? windowWidth * 0.01 : windowWidth * 0.00095}
            width={windowWidth * 0.1 * (isMobile ? 2 : 1.07)}
            height={slotHeight}
          />
        </>
      ))}
    </Container>
  );
};
