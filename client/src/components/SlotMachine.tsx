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
const totalSpinTime = 7000; // Total spin time in ms

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

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

const backout = (t: number): number => {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
};

const getRandomAsset = (): string => {
  return assets[Math.floor(Math.random() * assets.length)];
};

const updateAssetsMatrix = (matrix: Matrix): Matrix => {
  return matrix.map(column => [getRandomAsset(), ...column.slice(0, rows - 1)]);
};

export const SlotMachine: React.FC = () => {
  const [assetsMatrix, setAssetsMatrix] = useState<Matrix>(initializeAssetsMatrix);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [positions, setPositions] = useState<number[]>(Array(columns).fill(0));
  const ticker = useRef(new PIXI.Ticker());
  const startTimes = useRef<number[]>(Array(columns).fill(0));
  const stopTimes = useRef<number[]>(Array(columns).fill(0));
  const speeds = useRef<number[]>(Array(columns).fill(0));
  const windowWidth = window.innerWidth;
  const slotHeight = windowWidth * 0.1;
  const totalHeight = slotHeight * rows;
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    const handleTick = (ticker: PIXI.Ticker) => {
      const delta = ticker.deltaTime;
      if (spinning) {
        const now = Date.now();
        setPositions((prevPositions) =>
          prevPositions.map((pos, index) => {
            if (now >= stopTimes.current[index]) {
              speeds.current[index] = 0;
              return snapToGrid(pos, slotHeight);
            }

            const elapsed = now - startTimes.current[index];
            const duration = stopTimes.current[index] - startTimes.current[index];
            const t = Math.min(elapsed / duration, 1);
            const easedT = backout(t);
            const newPos = lerp(0, speeds.current[index] * (totalSpinTime / 2), easedT); // Adjusted speed multiplier
            return pos + newPos * delta;
          })
        );

        if (speeds.current.every((speed) => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) => realignMatrix(prevMatrix, positions, slotHeight));
          if (intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
          }
        }
      }
    };

    ticker.current.add(handleTick);
    ticker.current.start();

    return () => {
      ticker.current.remove(handleTick);
      ticker.current.stop();
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
      }
    };
  }, [spinning, slotHeight]);

  const startSpinning = () => {
    setAssetsMatrix(initializeAssetsMatrix()); // Reset the matrix when spinning starts
    setSpinning(true);
    speeds.current = Array(columns).fill(0).map(() => Math.random() * 0.5); // Slower initial speed values
    startTimes.current = Array(columns).fill(Date.now());
    stopTimes.current = Array(columns).fill(Date.now() + stopTime).map((time, index) => time + index * 1500); // Stagger the stopping times even more
    setPositions(Array(columns).fill(0));

    // Start the interval to update the assets matrix every second
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
    }
    intervalId.current = window.setInterval(() => {
      setAssetsMatrix((prevMatrix) => updateAssetsMatrix(prevMatrix));
    }, 1000);
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
