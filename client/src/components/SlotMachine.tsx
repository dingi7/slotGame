import { Container, Sprite, Stage } from "@pixi/react";
import React, { useEffect, useState, useRef } from "react";
import * as PIXI from "pixi.js";

// Define asset URLs
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

  useEffect(() => {
    const handleTick = (delta: number) => {
      if (spinning) {
        setPositions((prevPositions) =>
          prevPositions.map((pos) => (pos + delta * 10) % (window.innerWidth * 0.3))
        );
      }
    };

    ticker.current.add((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));
    ticker.current.start();

    return () => {
      ticker.current.stop();
    };
  }, [spinning]);

  const shuffleMatrix = () => {
    setSpinning(true);
    setTimeout(() => {
      setAssetsMatrix((prevMatrix) =>
        prevMatrix.map((column) =>
          column.map(() => assets[Math.floor(Math.random() * assets.length)])
        )
      );
      setSpinning(false);
    }, 2000); // Spin duration
  };

  const windowWidth = window.innerWidth;

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
          height={windowWidth * 0.3}
        >
          {assetsMatrix.map((column, colIndex) => (
            <Container x={colIndex * windowWidth * 0.15} key={colIndex}>
              {column.map((asset, rowIndex) => (
                <Sprite
                  key={rowIndex}
                  image={asset}
                  y={(positions[colIndex] + rowIndex * windowWidth * 0.1) % (windowWidth * 0.3)}
                  width={windowWidth * 0.1}
                  height={windowWidth * 0.1}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>

      <div className="w-full flex gap-[10%] justify-center items-center">
        <div className="flex gap-4 text-2xl">
          <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tl-lg rounded-bl-lg">
            -
          </button>
          <div className="flex flex-col justify-center">
            <p className="text-2xl">500</p>
            <p className="text-xl uppercase text-center">total bet</p>
          </div>
          <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tr-lg rounded-br-lg">
            +
          </button>
        </div>

        <div className="uppercase flex flex-col gap-4">
          <p>0</p>
          <p>win</p>
        </div>

        <button onClick={shuffleMatrix} className="uppercase">
          <p>Spin</p>
          <p>hold for auto</p>
        </button>
      </div>
    </div>
  );
};
