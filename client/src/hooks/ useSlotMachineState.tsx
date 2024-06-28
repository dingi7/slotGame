import * as PIXI from "pixi.js";

import { playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useState } from "react";

import { initializeAssetsMatrix } from "../utils/slotMachineUtils";
import { sendSpinRequest } from "../api/requests";
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

export const useSlotMachineState = () => {
  const windowWidth = window.innerWidth;
  const columnsCount = 3;
  const frameRate = 10;
  const btnDissableDuration = 3000; // 3 sec
  const minSpinTimes = 10;
  const minStopSpinInterval = 3;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * 3;
  const [spinIntervalDuration] = useState(60);
  const fixedBetAmounts = [20, 40, 100, 200];
  const tickers: PIXI.Ticker[] = Array(columnsCount).fill(new PIXI.Ticker());

  const [betAmount, setBetAmount] = useState(fixedBetAmounts[0]);
  const [spinningColumns, setSpinningColumns] = useState(Array(3).fill(false));
  const [columnStates, setColumnStates] = useState(initializeAssetsMatrix);
  const [positions, setPositions] = useState(Array(columnsCount).fill(0));
  const [showLine, setShowLine] = useState(false);

  const [balance, setBalance] = useState(5000);
  const [lastWin, setLastWin] = useState(0);
  const [desiredNums, setDesiredNums] = useState<number[]>();
  const [isModalOpen, setIsModalOpen] = useState({
    win: false,
    incificientFunds: false,
  });

  const [spinCounters, setSpinCounters] = useState(Array(columnsCount).fill(0));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      setTimeout(() => {
        setIsModalOpen((prevState) => ({ ...prevState, win: true }));
      }, spinIntervalDuration);
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, btnDissableDuration);
    }
    return result;
  };

  const startSpinning = async () => {
    setIsModalOpen((prevState) => ({ ...prevState, incificientFunds: false }));
    setIsModalOpen((prevState) => ({ ...prevState, win: false }));
    if (balance - betAmount < 0) {
      setIsModalOpen((prevState) => ({ ...prevState, incificientFunds: true }));
      return;
    }
    stopSound();
    playSound(spinningSound);
    setColumnStates((prevStates) =>
      prevStates.map((state) => ({ ...state, spinning: true }))
    );
    setSpinningColumns(Array(columnsCount).fill(true));
    await handleSpinRequest();
  };

  const resetColumnPositions = (columnIndex?: number) => {
    // if (columnIndex) {
    //   setPositions(() => [...positions, (positions[columnIndex] = 0)]);
    //   return;
    // }
    setPositions(Array(columnsCount).fill(0));
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
        resetColumnPositions();
        setColumnStates((prevStates) =>
          prevStates.map((column, colIndex) => {
            if (!column.spinning) return column;

            const newAssets = [...column.assets];
            const lastElement = newAssets.pop();
            if (lastElement) {
              newAssets.unshift(lastElement);
              handleSpinning(colIndex);
            }

            if (spinCounters[colIndex] < minSpinTimes) {
              setSpinCounters((prev) => {
                const newCounters = [...prev];
                newCounters[colIndex] += 1;
                return newCounters;
              });
              return { ...column, assets: newAssets };
            }

            const previousColumnStopped =
              colIndex === 0 || !spinningColumns[colIndex - 1];
            if (
              previousColumnStopped &&
              (colIndex === 0 ||
                spinCounters[colIndex] >=
                  spinCounters[colIndex - 1] + minStopSpinInterval)
            ) {
              if (newAssets[2].value === desiredNums![colIndex]) {
                setSpinningColumns((prev) => {
                  const newSpinningColumns = [...prev];
                  newSpinningColumns[colIndex] = false;
                  tickers[colIndex].stop();
                  setSpinCounters(Array(columnsCount).fill(0));
                  return newSpinningColumns;
                });
                return {
                  ...column,
                  assets: newAssets,
                  spinning: false,
                };
              }
            }

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
    const move = () => {
      const distanceToMove = slotHeight / frameRate;
      if (positions[columnIndex] + distanceToMove >= slotHeight) {
        tickers[columnIndex].stop();
        tickers[columnIndex].remove(move);
        return;
      }
      setPositions(() => [
        ...positions,
        (positions[columnIndex] += distanceToMove),
      ]);
    };

    tickers[columnIndex]
      .add((delta) => {
        move(delta);
      })
      .start();
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
    isButtonDisabled,
  };
};
