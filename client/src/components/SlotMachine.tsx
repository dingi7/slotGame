import { Container, Sprite, Stage } from "@pixi/react";
import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";

const assets = [
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
];
const columns = 3;
const rows = 3;

export const SlotMachine: React.FC = () => {
  const [assetsMatrix, setAssetsMatrix] = useState<string[][]>(
    Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => assets[Math.floor(Math.random() * assets.length)])
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [positions, setPositions] = useState(Array(columns).fill(0));
  const ticker = useRef(new PIXI.Ticker());
  const spinSpeed = useRef(Array(columns).fill(0));
  const targetPositions = useRef(Array(columns).fill(0));

  const windowWidth = window.innerWidth;
  const slotHeight = windowWidth * 0.1;
  const totalHeight = windowWidth * 0.3;

  useEffect(() => {
    const handleTick = (delta: number) => {
      if (spinning) {
        setPositions((prevPositions) =>
          prevPositions.map((pos, index) => {
            const newPos = pos + spinSpeed.current[index] * delta;
            if (newPos >= targetPositions.current[index]) {
              spinSpeed.current[index] = 0;
              return snapToGrid(targetPositions.current[index]);
            }
            return newPos;
          })
        );

        if (spinSpeed.current.every(speed => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) => realignMatrix(prevMatrix, positions));
        }
      }
    };

    const currentTicker = ticker.current;
    currentTicker.start();
    currentTicker.add((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));

    return () => {
      currentTicker.remove((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));
      currentTicker.stop();
    };
  }, [spinning]);

  const snapToGrid = (position: number) => {
    return Math.round(position / slotHeight) * slotHeight;
  };

  const realignMatrix = (matrix: string[][], positions: number[]) => {
    return matrix.map((column, colIndex) => {
      const offset = Math.floor(positions[colIndex] / slotHeight) % rows;
      return [...column.slice(offset), ...column.slice(0, offset)];
    });
  };

  const shuffleMatrix = () => {
    if (spinning) return;

    setSpinning(true);
    const newMatrix = assetsMatrix.map((column) =>
      column.map(() => assets[Math.floor(Math.random() * assets.length)])
    );
    setAssetsMatrix(newMatrix);

    spinSpeed.current = Array(columns).fill(0).map(() => Math.random() * 5 + 10);
    console.log(spinSpeed.current);
    targetPositions.current = positions.map(() => (Math.floor(Math.random() * 20 + 20)) * slotHeight);
    
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
          options={{ background: 0xfffff }}
          width={windowWidth * 0.4}
          height={totalHeight}
        >
          {assetsMatrix.map((column, colIndex) => (
            <Container x={colIndex * windowWidth * 0.15} key={colIndex}>
              {[...column, ...column].map((asset, rowIndex) => (
                <Sprite
                  key={rowIndex}
                  image={asset}
                  y={(positions[colIndex] + rowIndex * slotHeight) % (totalHeight * 2)}
                  width={windowWidth * 0.1}
                  height={slotHeight}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>
      <div className="w-full flex gap-[10%] justify-center items-center">
        {/* ... (betting controls remain the same) ... */}
        <button onClick={shuffleMatrix} className="uppercase" disabled={spinning}>
          <p>Spin</p>
          <p>hold for auto</p>
        </button>
      </div>
    </div>
  );
};