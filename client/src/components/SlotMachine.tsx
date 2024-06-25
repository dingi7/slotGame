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

const columns = 3;
const rows = 3;
const stopTime = 3000; // Time in ms to stop each column
const totalSpinTime = 7000; // Total spin time in ms

type Matrix = string[][];

const initializeAssetsMatrix = (): Matrix => {
  return Array.from({ length: columns }, () =>
    Array.from(
      { length: rows },
      () => assets[Math.floor(Math.random() * assets.length)]
    )
  );
};

const snapToGrid = (position: number, slotHeight: number): number => {
  return Math.round(position / slotHeight) * slotHeight;
};

const realignMatrix = (
  matrix: Matrix,
  positions: number[],
  slotHeight: number
): Matrix => {
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
  return matrix.map((column) => [
    getRandomAsset(),
    ...column.slice(0, rows - 1),
  ]);
};

export const SlotMachine: React.FC = () => {
  //const betInterval = 10;
  const fixedBetAmounts = [20, 40, 100, 200];
  const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);
  const [assetsMatrix, setAssetsMatrix] = useState<Matrix>(
    initializeAssetsMatrix
  );
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
            const duration =
              stopTimes.current[index] - startTimes.current[index];
            const t = Math.min(elapsed / duration, 1);
            const easedT = backout(t);
            const newPos = lerp(
              0,
              speeds.current[index] * (totalSpinTime / 2),
              easedT
            ); // Adjusted speed multiplier
            return pos + newPos * delta;
          })
        );

        if (speeds.current.every((speed) => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) =>
            realignMatrix(prevMatrix, positions, slotHeight)
          );
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
    speeds.current = Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.5); // Slower initial speed values
    startTimes.current = Array(columns).fill(Date.now());
    stopTimes.current = Array(columns)
      .fill(Date.now() + stopTime)
      .map((time, index) => time + index * 1500); // Stagger the stopping times even more
    setPositions(Array(columns).fill(0));

    // Start the interval to update the assets matrix every second
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
    }
    intervalId.current = window.setInterval(() => {
      setAssetsMatrix((prevMatrix) => updateAssetsMatrix(prevMatrix));
    }, 1000);
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
            <Container
              x={(colIndex !== 0 ? colIndex : 0.01) * windowWidth * 0.14}
              key={colIndex}
            >
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
          onClick={startSpinning}
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
