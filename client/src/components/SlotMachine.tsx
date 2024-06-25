import * as PIXI from "pixi.js";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

import { RefreshCcw } from "lucide-react";
import slotBackground from "../assets/slot-background.jpg";

// Define asset URLs
const assets = [
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
];

export const SlotMachine: React.FC = () => {
  //const betInterval = 10;
  const fixedBetAmounts = [20, 40, 100, 200];
  const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);

  const columns = 3;
  const rows = 3;

  const [assetsMatrix, setAssetsMatrix] = useState<string[][]>(
    Array.from({ length: columns }, () =>
      Array.from(
        { length: rows },
        () => assets[Math.floor(Math.random() * assets.length)]
      )
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

        if (spinSpeed.current.every((speed) => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) => realignMatrix(prevMatrix, positions));
        }
      }
    };

    const currentTicker = ticker.current;
    currentTicker.start();
    currentTicker.add((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));

    return () => {
      currentTicker.remove((ticker: PIXI.Ticker) =>
        handleTick(ticker.deltaTime)
      );
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

    spinSpeed.current = Array(columns)
      .fill(0)
      .map(() => Math.random() * 5 + 10);
    console.log(spinSpeed.current);
    targetPositions.current = positions.map(
      () => Math.floor(Math.random() * 20 + 20) * slotHeight
    );

    setPositions(Array(columns).fill(0));
  };

  const drawRect = (graphics: PIXI.Graphics) => {
    graphics.clear();
    graphics.lineStyle(5, 0x966304, 1);
    const fillColor = 0x08043c;
    graphics.beginFill(fillColor, 1);
    graphics.drawRoundedRect(0, 0, windowWidth * 0.11, slotHeight * rows, 5);
    graphics.endFill();
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center gap-5 bg-[url(${slotBackground})] text-white overflow-hidden`}
      style={{ backgroundImage: `url(${slotBackground})` }}
    >
      <div className="flex gap-4 pt-[2%]">
        <p className="uppercase text-yellow-400 text-2xl font-semibold text-shadow-superhot">
          slot machine
        </p>
      </div>

      <div className="my-auto relative">
        <Stage
          options={{ backgroundAlpha: 0 }}
          width={windowWidth * 0.391}
          height={totalHeight}

        >
          {assetsMatrix.map((column, colIndex) => (
            <Container x={(colIndex !== 0 ? colIndex : 0.01) * windowWidth * 0.14} key={colIndex}>
              <Graphics draw={(g: PIXI.Graphics) => drawRect(g)} />
              {[...column, ...column].map((asset, rowIndex) => (
                <Sprite
                  key={rowIndex}
                  image={asset}
                  y={
                    (positions[colIndex] + rowIndex * slotHeight) %
                    (totalHeight * 2)
                  }
                  x={
                    windowWidth >= 768
                      ? windowWidth * 0.005
                      : windowWidth * 0.004
                  }
                  width={windowWidth * 0.1}
                  height={slotHeight}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>

      <div className="w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly items-center select-none">
        <div>
          <p className="uppercase font-semibold">balance:</p>
          <p>5000 BGN</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="uppercase text-xs text-slate-300">
            please, place your bet{" "}
          </p>
          <div className="flex gap-4">
            {fixedBetAmounts.map((x) => (
              <div
                className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500  ${
                  betAmount === x
                    ? " bg-gradient-to-b from-green-500 to-green-800"
                    : "bg-stone-600"
                }`}
                onClick={() => setBetAmount(x)}
              >
                <p className="flex gap-[2%]">
                  <span className="font-semibold">{x}</span> <span>BGN</span>
                </p>
                <p className="text-yellow-300 uppercase">bet</p>
              </div>
            ))}
          </div>
        </div>

        <button
          className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200"
          onClick={shuffleMatrix}
        >
          <RefreshCcw className="opacity-100" />
        </button>

        <div className="uppercase">
          <p className="font-semibold">last win:</p>
          <p>0</p>
        </div>
      </div>
    </div>
  );
};
