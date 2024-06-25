import * as PIXI from "pixi.js";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

import { RefreshCcw } from "lucide-react";
import { assets } from "../assets/reelAssets";
import { sendSpinRequest } from "../api/requests";
import slotBackground from "../assets/slot-background.jpg";
import { SlotMachineFooter } from "./SlotMachineFooter";

const columns = 3;
const rows = 3;
const stopTime = 1000; // Time in ms to stop each column
const totalSpinTime = 3000; // Total spin time in ms

type Matrix = { image: string; value: number }[][];

type Asset = {
  image: string;
  value: number;
};

type ColumnStateType = {
  assets: Asset[];
  spinning: boolean;
  middleRowIndex: number;
};

const snapToGrid = (position: number, slotHeight: number): number => {
  return Math.round(position / slotHeight) * slotHeight;
};

const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// Modified easing function for slower end
const backout = (t: number): number => {
  const s = 1.70158;
  return --t * t * ((s + 1) * t + s) + 1;
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

const initializeAssetsMatrix = (): ColumnStateType[] => {
  const columnStates: ColumnStateType[] = Array.from(
    { length: columns },
    () => ({
      assets: shuffleArray([...assets]),
      spinning: false,
      middleRowIndex: Math.floor(rows / 2),
    })
  );

  return columnStates;
};

const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const SlotMachine: React.FC = () => {
  const fixedBetAmounts = [20, 40, 100, 200];
  const [win, setWin] = useState<boolean>(false);
  const [payout, setPayout] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);

  const [spinningColumns, setSpinningColumns] = useState<boolean[]>(
    Array(columns).fill(false)
  );

  const [columnStates, setColumnStates] = useState<ColumnStateType[]>(
    initializeAssetsMatrix
  );

  const [positions, setPositions] = useState<number[]>(Array(columns).fill(0));
  const [showLine, setShowLine] = useState<boolean>(false);

  const ticker = useRef(new PIXI.Ticker());
  const startTimes = useRef<number[]>(Array(columns).fill(0));
  const stopTimes = useRef<number[]>(Array(columns).fill(0));
  const speeds = useRef<number[]>(Array(columns).fill(0));
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * rows;
  const intervalId = useRef<number | null>(null);
  const lineIntervalId = useRef<number | null>(null);
  const [balance, setBalance] = useState<number>(5000);
  const [lastWin, setLastWin] = useState<number>(0);

  const [desiredNums, setDesiredNums] = useState<number[]>();

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount);
    setDesiredNums(Object.values(result.reels).map((num) => parseInt(num)));
    setWin(result.win);
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
      setBalance((prevBalance) => prevBalance + result.payout);
      setLastWin(result.payout);
    }
    return result;
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

  const startSpinning = async () => {
    setColumnStates((prevStates) =>
      prevStates.map((state) => ({ ...state, spinning: true }))
    );
    setSpinningColumns(Array(columns).fill(true));
    // Handle other actions needed to start spinning
    await handleSpinRequest();

    // Assuming this function is defined to handle spin request
  };

  useEffect(() => {
    console.log(desiredNums);
  }, [desiredNums]);

  useEffect(() => {
    if (spinningColumns.some((spinning) => spinning)) {
      const interval = setInterval(() => {
        setColumnStates((prevStates) =>
          prevStates.map((column, colIndex) => {
            if (!column.spinning) return column;
            const newAssets = [...column.assets];
            const lastElement = newAssets.pop();
            if (lastElement) {
              newAssets.unshift(lastElement);
            }
            // Check if the middle row (index 1) matches the desired number for this column
            if (newAssets[1].value === desiredNums[colIndex]) {
              setSpinningColumns((prev) => {
                const newSpinningColumns = [...prev];
                newSpinningColumns[colIndex] = false;
                return newSpinningColumns;
              });
              return { ...column, assets: newAssets, spinning: false };
            }
            return { ...column, assets: newAssets };
          })
        );
      }, 100); // Adjust the interval as needed

      return () => clearInterval(interval);
    }
  }, [spinningColumns, desiredNums]);

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
            {columnStates.map((column, colIndex) => (
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
            ))}
            {showLine && <Graphics draw={(g: PIXI.Graphics) => drawLine(g)} />}
          </Stage>
        </div>

        {isMobile && (
          <div className="mb-[10%] flex flex-col gap-2">
            <p className="uppercase text-xs text-slate-300">
              please, place your bet
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
                    <span className="font-semibold">{x}</span>
                    <span>BGN</span>
                  </p>
                  <p className="text-yellow-300 uppercase">bet</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* <div
        className={`w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly ${
          isMobile ? "items-end" : "items-center"
        } select-none relative h-[15%]`}
      >
        <div>
          <p className="uppercase font-semibold">balance:</p>
          <p>{balance} BGN</p>
        </div>

        {!isMobile && (
          <div className=" flex flex-col gap-2 relative">
            <p className="uppercase text-xs text-slate-300 absolute -top-5 left-1/2 -translate-x-[50%]">
              please, place your bet
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
                    <span className="font-semibold">{x}</span>
                    <span>BGN</span>
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
            //onClick={startSpinning}
            disabled={spinningColumns.some((x) => x === true)}
          >
            <RefreshCcw
              className={`opacity-100 ${
                spinningColumns.some((x) => x === true) ? "animate-spin" : ""
              } w-3/5 h-3/5`}
            />
          </button>
        )}

        {!isMobile && (
          <button
            className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200"
            onClick={() => {
              startSpinning();
            }}
            disabled={spinningColumns.some((x) => x === true)}
          >
            <RefreshCcw
              className={`opacity-100 ${
                spinningColumns.some((x) => x === true) ? "animate-spin" : ""
              }`}
            />
          </button>
        )}

        <div className="uppercase">
          <p className="font-semibold">last win:</p>
          <p>{lastWin}</p>
        </div>
      </div> */}
      <SlotMachineFooter
        isMobile={isMobile}
        balance={balance}
        lastWin={lastWin}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        startSpinning={startSpinning}
        spinningColumns={spinningColumns}
        fixedBetAmounts={fixedBetAmounts}
      />
    </div>
  );
};
