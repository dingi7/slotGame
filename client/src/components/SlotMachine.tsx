import * as PIXI from "pixi.js";

import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";
import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

import { sendSpinRequest } from "../api/requests";
import slotBackground from "../assets/slot-background.jpg";

const assets = [
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 1,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 2,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 3,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 4,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 5,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 6,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 7,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 8,
  },
  {
    image:
      "https://png.pngtree.com/png-clipart/20210123/ourmid/pngtree-black-colorful-number-1-png-image_2786493.jpg",
    value: 9,
  },
];
const columns = 3;
const rows = 3;
const stopTime = 1000; // Time in ms to stop each column
const totalSpinTime = 3000; // Total spin time in ms

type Matrix = { image: string; value: number }[][];

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

// Modified easing function for slower end
const backout = (t: number): number => {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
};

const getRandomAsset = (): { image: string; value: number } => {
  return assets[Math.floor(Math.random() * assets.length)];
};

const updateAssetsMatrix = (matrix: Matrix): Matrix => {
  return matrix.map((column) => [
    getRandomAsset(),
    ...column.slice(0, rows - 1),
  ]);
};

const setWinningLine = (matrix: Matrix, value: number): Matrix => {
  const winningLine = assets.find((asset) => asset.value === value);
  if (!winningLine) return matrix;

  return matrix.map((column) => {
    const newColumn = [...column];
    newColumn[1] = winningLine; // Set the middle row to the winning value
    return newColumn;
  });
};

export const SlotMachine: React.FC = () => {
  const fixedBetAmounts = [20, 40, 100, 200];
  const [win, setWin] = useState<boolean>(false);
  const [payout, setPayout] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);
  const [assetsMatrix, setAssetsMatrix] = useState<Matrix>(
    initializeAssetsMatrix
  );
  const [spinning, setSpinning] = useState<boolean>(false);
  const [positions, setPositions] = useState<number[]>(Array(columns).fill(0));
  const [showLine, setShowLine] = useState<boolean>(false);

  const ticker = useRef(new PIXI.Ticker());
  const startTimes = useRef<number[]>(Array(columns).fill(0));
  const stopTimes = useRef<number[]>(Array(columns).fill(0));
  const speeds = useRef<number[]>(Array(columns).fill(0));
  const windowWidth = window.innerWidth;
  const [expandedDrawer, setExpandedDrawer] = useState<boolean>(false);
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * rows;
  const intervalId = useRef<number | null>(null);
  const lineIntervalId = useRef<number | null>(null);

  useEffect(() => {
    const handleTick = () => {
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
              speeds.current[index] * (totalSpinTime / 4), // Adjusted speed multiplier
              easedT
            );
            return (pos + newPos) % (totalHeight * 2);
          })
        );

        if (speeds.current.every((speed) => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) =>
            realignMatrix(prevMatrix, positions, slotHeight)
          );
          if (win) {
            setAssetsMatrix((prevMatrix) => setWinningLine(prevMatrix, payout));
            setShowLine(true); // Start by showing the line
            lineIntervalId.current = window.setInterval(() => {
              setShowLine((prevShowLine) => !prevShowLine); // Toggle the line visibility
            }, 500); // Flash every 500ms
            setTimeout(() => {
              if (lineIntervalId.current !== null) {
                clearInterval(lineIntervalId.current);
                lineIntervalId.current = null;
              }
              setShowLine(false); // Ensure the line is hidden after 4 seconds
            }, 4000);
          }
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
      if (lineIntervalId.current !== null) {
        clearInterval(lineIntervalId.current);
      }
    };
  }, [spinning, slotHeight, win, payout]);

  const startSpinning = async () => {
    setAssetsMatrix(initializeAssetsMatrix()); // Reset the matrix when spinning starts
    setSpinning(true);
    speeds.current = Array(columns)
      .fill(0)
      .map(() => Math.random() * 0.2); // Slower initial speed values
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

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    console.log(result);
    setWin(true);
    setPayout(result.payout);
    if (result.win) {
      setTimeout(() => {
        setShowLine(true);
        const lineIntervalId = setInterval(() => {
          setShowLine((prevShowLine) => !prevShowLine);
        }, 500);
        setTimeout(() => {
          clearInterval(lineIntervalId);
          setShowLine(false);
        }, totalSpinTime);
      }, totalSpinTime + 1000);
    }
  };

  const drawRect = (graphics: PIXI.Graphics) => {
    graphics.clear();
    graphics.lineStyle(5, 0x966304, 1);
    const fillColor = 0x08043c;
    graphics.beginFill(fillColor, 1);
    graphics.drawRoundedRect(
      0,
      0,
      windowWidth * 0.11 * (isMobile ? 2 : 1),
      slotHeight * rows,
      5
    );
    graphics.endFill();
  };

  const drawLine = (graphics: PIXI.Graphics) => {
    if (!showLine) {
      graphics.clear();
      return;
    }
    graphics.clear();
    graphics.lineStyle(4, 0xff0000, 1); // Red color line with thickness 4
    graphics.moveTo(0, slotHeight * 1.5);
    graphics.lineTo(
      windowWidth * 0.391 * (windowWidth <= 768 ? 2 : 1),
      slotHeight * 1.5
    );
    graphics.endFill();
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center gap-5 bg-[url(${slotBackground})] ${
        isMobile && "bg-cover"
      } text-white overflow-hidden`}
      style={{ backgroundImage: `url(${slotBackground})` }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex gap-4 pt-[2%]">
          <p className="uppercase text-yellow-400 text-2xl font-semibold text-shadow-superhot">
            slot machine
          </p>
        </div>

        <div className="my-auto relative">
          <Stage
            options={{ backgroundAlpha: 0 }}
            width={windowWidth * 0.391 * (isMobile ? 2 : 1)}
            height={totalHeight}
          >
            {assetsMatrix.map((column, colIndex) => (
              <Container
                x={
                  (colIndex !== 0 ? colIndex : 0.01) *
                  windowWidth *
                  0.14 *
                  (isMobile ? 2 : 1)
                }
                key={colIndex}
              >
                <Graphics draw={(g: PIXI.Graphics) => drawRect(g)} />
                {[...column, ...column].map((asset, rowIndex) => (
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
            ))}
          </Stage>
        </div>

        {isMobile && (
          <div className="mb-[10%] flex flex-col gap-2">
            <p className="uppercase text-xs text-slate-300">
              please, place your bet{" "}
            </p>
            <div className={`flex flex-row gap-2 md:gap-4`}>
              {fixedBetAmounts.map((x) => (
                <div
                  className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500 text-sm md:text-base ${
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
        )}
      </div>

      <div
        className={`w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly ${
          isMobile ? "items-end" : "items-center"
        } select-none relative h-[15%]`}
      >
        <div>
          <p className="uppercase font-semibold">balance:</p>
          <p>5000 BGN</p>
        </div>

        {!isMobile && (
          <div className=" flex flex-col gap-2 relative">
            <p className="uppercase text-xs text-slate-300 absolute -top-5 left-1/2 -translate-x-[50%]">
              please, place your bet{" "}
            </p>
            <div className={`flex flex-row gap-2 md:gap-4`}>
              {fixedBetAmounts.map((x) => (
                <div
                  className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500 text-sm md:text-base ${
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
        )}

        {isMobile && (
          <button
            className=" bg-stone-900/50 p-[2.5%]  h-full aspect-square flex justify-center items-center rounded-full border-2 border-slate-200 "
            onClick={startSpinning}
            disabled={spinning}
          >
            <RefreshCcw
              className={`opacity-100 ${
                spinning ? "animate-spin" : ""
              } w-3/5 h-3/5`}
            />
          </button>
        )}

        {!isMobile && (
          <button
            className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200"
            onClick={() => {
              handleSpinRequest();
              startSpinning();
            }}
            disabled={spinning}
          >
            <RefreshCcw
              className={`opacity-100 ${spinning ? "animate-spin" : ""}`}
            />
          </button>
        )}

        <div className="uppercase">
          <p className="font-semibold">last win:</p>
          <p>{payout}</p>
        </div>
      </div>
    </div>
  );
};
