import * as PIXI from "pixi.js";

import { playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useRef, useState } from "react";

import { initializeAssetsMatrix } from "../utils/slotMachineUtils";
import { sendSpinRequest } from "../api/requests";
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

export const useSlotMachineState = () => {
  const fixedBetAmounts = [20, 40, 100, 200];
  const [betAmount, setBetAmount] = useState(fixedBetAmounts[0]);
  const [spinningColumns, setSpinningColumns] = useState(Array(3).fill(false));
  const [columnStates, setColumnStates] = useState(initializeAssetsMatrix);
  const [positions, setPositions] = useState(Array(3).fill(0));
  const [showLine, setShowLine] = useState(false);
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * 3;
  const [balance, setBalance] = useState(5000);
  const [lastWin, setLastWin] = useState(0);
  const [desiredNums, setDesiredNums] = useState<number[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickers: PIXI.Ticker[] = Array(3).fill(new PIXI.Ticker());
  const [spinIntervalDuration, setspinIntervalDuration] = useState(60);
  const minSpinTimes = 10;
  const minStopSpinInterval = 3
  const [spinCounters, setSpinCounters] = useState(Array(3).fill(0));



  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount);
    setDesiredNums(Object.values(result.reels).map((num) => Number(num)));
    if (result.win) {
      playSound(winSound);
      setTimeout(() => {
        setShowLine(true);
        const lineIntervalId = setInterval(() => {
          setShowLine((prevShowLine) => !prevShowLine);
        }, 500);
        setTimeout(() => {
          clearInterval(lineIntervalId);
          setShowLine(false);
        }, 3000);
      }, 4000);
      setBalance((prevBalance) => prevBalance + result.payout);
      setLastWin(result.payout);
    }
    return result;
  };

  const startSpinning = async () => {
    setIsModalOpen(false);
    stopSound();
    playSound(spinningSound);
    setColumnStates((prevStates) =>
      prevStates.map((state) => ({ ...state, spinning: true }))
    );
    setSpinningColumns(Array(3).fill(true));
    await handleSpinRequest();
  };

  useEffect(() => {
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
          setPositions(Array(3).fill(0));
          if (!column.spinning) return column;

          const newAssets = [...column.assets];
          const lastElement = newAssets.pop();
          if (lastElement) {
            newAssets.unshift(lastElement);
            handleSpinning(colIndex);
          }

          // Ensure each column spins at least minSpinTimes times
          if (spinCounters[colIndex] < minSpinTimes) {
            setSpinCounters((prev) => {
              const newCounters = [...prev];
              newCounters[colIndex] += 1;
              return newCounters;
            });
            return { ...column, assets: newAssets };
          }

          // Ensure a minimum stop interval between columns
          const previousColumnStopped =
            colIndex === 0 || !spinningColumns[colIndex - 1];
          if (
            previousColumnStopped &&
            (colIndex === 0 ||
              spinCounters[colIndex] >= spinCounters[colIndex - 1] + minStopSpinInterval)
          ) {
            if (newAssets[2].value === desiredNums![colIndex]) {
              setSpinningColumns((prev) => {
                const newSpinningColumns = [...prev];
                newSpinningColumns[colIndex] = false;
                tickers[colIndex].stop();
                setSpinCounters(Array(3).fill(0))
                return newSpinningColumns;
              });
              return {
                ...column,
                assets: newAssets,
                spinning: false,
              };
            }
          }

          // Increment the spin counter
          setSpinCounters((prev) => {
            const newCounters = [...prev];
            newCounters[colIndex] += 1;
            return newCounters;
          });

          return { ...column, assets: newAssets };
        })
      );
    }, spinIntervalDuration);

    return () => clearInterval(interval);
  }
}, [spinningColumns, desiredNums, spinCounters]);


  const handleSpinning = (columnIndex: number) => {
    const move = (delta: any) => {
      if (positions[columnIndex] + 1 >= slotHeight) {
        return;
      }
      setPositions(() => [
        ...positions,
        (positions[columnIndex] += slotHeight / 30),
      ]);
    };

    tickers[columnIndex]
      .add((delta) => {
        move(delta);
      })
      .start();

    if (positions[columnIndex] >= slotHeight) {
      tickers[columnIndex].stop();
      tickers[columnIndex].remove(move);
      setPositions(() => [...positions, (positions[columnIndex] = 0)]);
    }
  };

  return {
    isMobile,
    windowWidth,
    slotHeight,
    totalHeight,
    columnStates,
    spinningColumns,
    positions,
    showLine,
    lastWin,
    isModalOpen,
    betAmount,
    fixedBetAmounts,
    setBetAmount,
    startSpinning,
    balance,
  };
};
