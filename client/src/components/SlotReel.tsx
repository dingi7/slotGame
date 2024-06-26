import React from 'react';
import { Container, Graphics, Sprite } from '@pixi/react';
import { drawRect } from '../utils/drawUtils';
import * as PIXI from 'pixi.js';
import { ColumnStateType } from '../types/slotMachineTypes';

interface SlotColumnProps {
    column: ColumnStateType;
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
            key={colIndex}
        >
            <Graphics
                draw={(g: PIXI.Graphics) =>
                    drawRect(g, windowWidth, slotHeight, isMobile)
                }
            />
            {column.assets.slice(0, 3).map((asset, rowIndex) => (
                <Sprite
                    key={rowIndex}
                    image={asset.image}
                    y={
                        (positions[colIndex] + rowIndex * slotHeight) %
                        (totalHeight * 2)
                    }
                    x={isMobile ? windowWidth * 0.01 : windowWidth * 0.005}
                    width={windowWidth * 0.1 * (isMobile ? 2 : 1)}
                    height={slotHeight}
                />
            ))}
        </Container>
    );
};
