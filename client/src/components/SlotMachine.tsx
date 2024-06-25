import { Container, Sprite, Stage } from "@pixi/react";
import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";

const assets: string[] = [
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
];
const columns = 3;
const rows = 3;
const stopTime = 3000; // Time in ms to stop each column

type Matrix = string[][];

const initializeAssetsMatrix = (): Matrix => {
  return Array.from({ length: columns }, () =>
    Array.from({ length: rows }, () => assets[Math.floor(Math.random() * assets.length)])
  );
};

const snapToGrid = (position: number, slotHeight: number): number => {
  return Math.round(position / slotHeight) * slotHeight;
};

const realignMatrix = (matrix: Matrix, positions: number[], slotHeight: number): Matrix => {
  return matrix.map((column, colIndex) => {
    const offset = Math.floor(positions[colIndex] / slotHeight) % rows;
    return [...column.slice(offset), ...column.slice(0, offset)];
  });
};

export const SlotMachine: React.FC = () => {
  const [assetsMatrix, setAssetsMatrix] = useState<Matrix>(initializeAssetsMatrix);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [positions, setPositions] = useState<number[]>(Array(columns).fill(0));
  const ticker = useRef(new PIXI.Ticker());
  const speeds = useRef<number[]>(Array(columns).fill(0));
  const stopTimes = useRef<number[]>(Array(columns).fill(0));
  const windowWidth = window.innerWidth;
  const slotHeight = windowWidth * 0.1;
  const totalHeight = slotHeight * rows;

  useEffect(() => {
    const handleTick = (ticker: PIXI.Ticker) => {
      const delta = ticker.deltaTime;
      if (spinning) {
        setPositions((prevPositions) =>
          prevPositions.map((pos, index) => {
            const newPos = pos + speeds.current[index] * delta;
            if (Date.now() >= stopTimes.current[index]) {
              speeds.current[index] = 0;
              return snapToGrid(newPos, slotHeight);
            }
            return newPos;
          })
        );

        if (speeds.current.every((speed) => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) => realignMatrix(prevMatrix, positions, slotHeight));
        }
      }
    };

    ticker.current.add(handleTick);
    ticker.current.start();

    return () => {
      ticker.current.remove(handleTick);
      ticker.current.stop();
    };
  }, [spinning, slotHeight]);

  const startSpinning = () => {
    setAssetsMatrix(initializeAssetsMatrix()); // Reset the matrix when spinning starts
    setSpinning(true);
    speeds.current = Array(columns).fill(0).map(() => Math.random() * 5 + 8);
    stopTimes.current = Array(columns).fill(Date.now() + stopTime).map((time, index) => time + index * 500);
    setPositions(Array(columns).fill(0));
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div>
        <p className="flex gap-[5%]">
          <span className="w-fit">Mega Jackpot</span> <span>77777</span>
        </p>
      </div>
      <div>
        <Stage
          options={{ background: 0xffffff }}
          width={windowWidth * 0.4}
          height={totalHeight}
        >
          {assetsMatrix.map((column, colIndex) => (
            <Container x={colIndex * windowWidth * 0.15} key={colIndex}>
              {column.map((asset, rowIndex) => (
                <Sprite
                  key={rowIndex}
                  image={asset}
                  y={(positions[colIndex] + rowIndex * slotHeight) % totalHeight}
                  width={windowWidth * 0.1}
                  height={slotHeight}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>
      <div className="w-full flex gap-[10%] justify-center items-center">
        <button onClick={startSpinning} className="uppercase" disabled={spinning}>
          <p>Spin</p>
          <p>hold for auto</p>
        </button>
      </div>
    </div>
  );
};