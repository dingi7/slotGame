import * as PIXI from "pixi.js";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useState } from "react";

import { SlotMachineFooter } from "./SlotMachineFooter";
import { WinningModal } from "./WinningModal";
import { assets } from "../assets/reelAssets";
import { sendSpinRequest } from "../api/requests";
import slotBackground from "../assets/slot-background.jpg";
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

const columns = 3;
const rows = 3;
const stopTime = 1000; // Time in ms to stop each column
const totalSpinTime = 3000; // Total spin time in ms

type Asset = {
  image: string;
  value: number;
};

type ColumnStateType = {
  assets: Asset[];
  spinning: boolean;
  middleRowIndex: number;
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

  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * rows;

  const [balance, setBalance] = useState<number>(5000);
  const [lastWin, setLastWin] = useState<number>(0);

  const [desiredNums, setDesiredNums] = useState<number[]>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount);
    setDesiredNums(Object.values(result.reels).map((num) => parseInt(num)));
    setWin(result.win);
    setPayout(result.payout);
    if (result.win) {
      setIsModalOpen(true)
      playSound(winSound);
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
    //setIsModalOpen(false);
    stopSound();
    playSound(spinningSound);
    setColumnStates((prevStates) =>
      prevStates.map((state) => ({ ...state, spinning: true }))
    );
    setSpinningColumns(Array(columns).fill(true));
    await handleSpinRequest();
  };

  useEffect(() => {
    // Check if all columnStates are spinning = false
    const allStopped = columnStates.every(
      (column) => column.spinning === false
    );

    if (allStopped) {
      stopSound();
    }
  }, [columnStates]);

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
      {isModalOpen && lastWin && <WinningModal winAmmount={lastWin} />}
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
