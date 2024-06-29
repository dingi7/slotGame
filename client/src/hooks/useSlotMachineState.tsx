import * as PIXI from "pixi.js";

import { ReelStateType, Reels } from "../types/slotMachineTypes";
import { playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useState } from "react";

import { initializeAssetsMatrix } from "../utils/slotMachineUtils";
import { sendSpinRequest } from "../api/requests";
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

type ReelIndex = 0 | 1 | 2;

export const useSlotMachineState = () => {
  const windowWidth = window.innerWidth;
  const columnsCount = 3;
  const frameRate = 10;
  const btnDissableDuration = 3000; // 3 sec
  const minSpinTimes = 10;
  const minIconsMoved = 3;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * 3;
  const [spinIntervalDuration] = useState(60);
  const [hasHandledWin, setHasHandledWin] = useState<boolean>(true);

  const betOptions: { [key: number]: number[] } = {
    // Adjust the bet options here
    1: [1, 2, 3, 4, 5],
    2: [5, 10, 15, 20, 25],
    3: [10, 20, 30, 40, 50],
    4: [20, 40, 60, 80, 100],
  };

  const [fixedBetAmounts, setFixedBetAmounts] = useState<number[]>(
    betOptions[1]
  );

  const handleBetAmountChange = (betOption: number) => {
    setFixedBetAmounts(betOptions[betOption]);
  };

  const tickers: PIXI.Ticker[] = Array(columnsCount).fill(new PIXI.Ticker());

  const [betAmount, setBetAmount] = useState(fixedBetAmounts[0]);
  const [spinningReels, setSpinningColumns] = useState(Array(3).fill(false));
  const [columnStates, setColumnStates] = useState<Reels>(
    initializeAssetsMatrix
  );
  const [positions, setPositions] = useState(Array(columnsCount).fill(0));
  const [showLine, setShowLine] = useState(false);

  const [balance, setBalance] = useState(5000);
  const [lastWin, setLastWin] = useState(0);
  const [desiredNums, setDesiredNums] = useState<number[]>();
  const [isModalOpen, setIsModalOpen] = useState({
    win: false,
    incificientFunds: false,
    doubleWinAmountModal: false,
  });

  const [reelIconsMoved, setReelIcons] = useState(Array(columnsCount).fill(0));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount);
    setDesiredNums(Object.values(result.reels).map((num) => Number(num)));
    if (result.win) {
      setHasHandledWin(false);
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
    setHasHandledWin(true);
    setIsModalOpen((prevState) => ({
      ...prevState,
      incificientFunds: false,
      win: false,
      doubleWinAmountModal: false,
    }));
    if (balance - betAmount < 0) {
      setIsModalOpen((prevState) => ({ ...prevState, incificientFunds: true }));
      return;
    }
    stopSound();
    playSound(spinningSound);
    setColumnStates(
      (prevStates) =>
        prevStates.map((state) => ({ ...state, spinning: true })) as Reels
    );
    setSpinningColumns(Array(columnsCount).fill(true));
    await handleSpinRequest();
  };

  const moveReelIcon = (reel: ReelIndex) => {
    setReelIcons((prev) => {
      const reelIcons = [...prev];
      reelIcons[reel] += 1;
      return reelIcons;
    });
  };

  const resetColumnPositions = () => {
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
    if (spinningReels.some((spinning) => spinning)) {
      const interval = setInterval(() => {
        resetColumnPositions();
        setColumnStates(
          (prevStates: Reels) =>
            prevStates.map((column: ReelStateType, reelIndex: number) => {
              if (!column.spinning) return column;

              const newAssets = [...column.assets];
              const lastElement = newAssets.pop();
              if (lastElement) {
                newAssets.unshift(lastElement);
                handleSpinning(reelIndex);
              }

              if (reelIconsMoved[reelIndex] < minSpinTimes) {
                moveReelIcon(reelIndex as ReelIndex);
                return { ...column, assets: newAssets };
              }

              const previousReelStopped = !spinningReels[reelIndex - 1];
              const isFirstReel = reelIndex === 0;

              if (
                isFirstReel ||
                (previousReelStopped &&
                  reelIconsMoved[reelIndex] >=
                    reelIconsMoved[reelIndex - 1] + minIconsMoved)
              ) {
                if (newAssets[2].value === desiredNums![reelIndex]) {
                  setSpinningColumns((prev) => {
                    const newSpinningColumns = [...prev];
                    newSpinningColumns[reelIndex] = false;
                    tickers[reelIndex].stop();
                    setReelIcons(Array(columnsCount).fill(0));
                    return newSpinningColumns;
                  });
                  return {
                    ...column,
                    assets: newAssets,
                    spinning: false,
                  };
                }
              }

              moveReelIcon(reelIndex as ReelIndex);

              return { ...column, assets: newAssets };
            }) as Reels
        );
      }, spinIntervalDuration);

      return () => clearInterval(interval);
    }
  }, [spinningReels, desiredNums, reelIconsMoved]);

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
      .add(() => {
        move();
      })
      .start();
  };

  const openDoubleWinAmountModal = () => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      doubleWinAmountModal: true,
    }));
  };

  return {
    isMobile,
    windowWidth,
    slotHeight,
    totalHeight,
    columnStates,
    spinningReels,
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
    handleBetAmountChange,
    openDoubleWinAmountModal,
    hasHandledWin,
  };
};
