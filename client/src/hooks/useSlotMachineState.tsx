import * as PIXI from "pixi.js";

import { Asset, ReelStateType, Reels } from "../types/slotMachineTypes";
import { playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useRef, useState } from "react";

import { ModalState } from "./useModal";
import { assets } from "../assets/reelAssets";
import { initializeAssetsMatrix } from "../utils/slotMachineUtils";
import { sendSpinRequest } from "../api/requests";
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

type ReelIndex = 0 | 1 | 2;

interface SlotMachineProps {
  openModal: (modal: ModalState) => void;
  closeModal: (modal?: ModalState) => void;
}

export const useSlotMachine = ({ openModal, closeModal }: SlotMachineProps) => {
  const windowWidth = window.innerWidth;
  const columnsCount = 3;
  const rowsCount = 3;
  const frameRate = 10;
  const btnDissableDuration = 1000; // 3 sec
  const minSpinTimes = 10;
  const minIconsToBeMoved = 3;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * 3;
  const [spinIntervalDuration] = useState(60);
  const [hasHandledWin, setHasHandledWin] = useState<boolean>(true);
  const [isAutoSpinEnabled, setIsAutoSpinEnabled] = useState<boolean>(false);

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
  const [desiredNums, setDesiredNums] = useState<number[][]>();
  const [tempWinning, setTempWinning] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);

  const [winningMatrix, setWinningMatrix] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!desiredNums) {
      return;
    }

    setColumnStates((prevState) => {
      // Create a copy of the previous state to avoid direct mutation
      const newState: Reels = [
        { ...prevState[0], assets: [...prevState[0].assets] },
        { ...prevState[1], assets: [...prevState[1].assets] },
        { ...prevState[2], assets: [...prevState[2].assets] },
      ];

      for (let row = 0; row < rowsCount; row++) {
        const rowSymbols = desiredNums[row];

        rowSymbols.forEach((symbol: number, colIndex: number) => {
          const symbolIndex = newState[colIndex].assets.findIndex(
            (asset) => asset.value === symbol
          );

          if (symbolIndex !== -1) {
            // Remove the symbol from the array
            newState[colIndex].assets.splice(symbolIndex, 1);
          }
        });
      }

      // Push the desired symbols back to the end of the respective column's assets array
      for (let col = 0; col < columnsCount; col++) {
        for (let row = 0; row < rowsCount; row++) {
          const desiredNum = desiredNums[row][col];
          // Assuming you have an `Asset` constructor or factory function to create an Asset object
          const asset = assets.find((x: Asset) => x.value === desiredNum);
          if (asset) {
            newState[col].assets.push(asset);
          }
        }
      }
      console.log(desiredNums);
      console.log(newState);

      return newState;
    });
  }, [desiredNums]);

  //ensure that desired numbers match reels state

  const [reelIconsMoved, setReelIcons] = useState(Array(columnsCount).fill(0));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount + result.payout);
    setDesiredNums(
      Object.values(result.reels).map((reel) => reel.map((num) => Number(num)))
    );
    if (result.win) {
      setHasWon(true);
      setTempWinning(result.payout);
      setWinningMatrix(result.winningMatrix);
    }
    return result;
  };

  const payoutsHandler = (amount: number) => {
    if (!hasHandledWin) {
      setHasHandledWin(true);
      setBalance((prevBalance) => prevBalance + amount);
      setLastWin(amount);
    }
  };

  const startSpinning = async () => {
    setHasWon(false);
    setHasHandledWin(true);
    closeModal();
    if (balance - betAmount < 0) {
      openModal("insufficientFunds");
      return;
    }
    stopSound();
    setColumnStates((prevState: Reels) => [
      {
        ...prevState[0],
        assets: prevState[0].assets.slice(-9),
      },
      {
        ...prevState[1],
        assets: prevState[1].assets.slice(-9),
      },
      {
        ...prevState[2],
        assets: prevState[2].assets.slice(-9),
      },
    ]);

    playSound(spinningSound);
    setColumnStates(
      (prevStates) =>
        prevStates.map((state) => ({
          ...state,
          spinning: true,
        })) as Reels
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

  const toggleLine = () => {
    setShowLine(true);

    const intervalDuration = 500;
    const totalDuration = 3000;
    const toggleIntervalId = setInterval(() => {
      setShowLine((prevShowLine) => !prevShowLine);
    }, intervalDuration);

    setTimeout(() => {
      clearInterval(toggleIntervalId);
      setShowLine(false);
    }, totalDuration);
  };

  useEffect(() => {
    const allStopped = columnStates.every(
      (column) => column.spinning === false
    );
    if (allStopped) {
      stopSound();
    }
    if (allStopped && hasWon) {
      setIsButtonDisabled(true);
      setHasHandledWin(false);
      playSound(winSound);

      // Immediately show the line without waiting
      toggleLine();

      setTimeout(() => {
        openModal("win");
      }, spinIntervalDuration);

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, btnDissableDuration);
    }
    if (allStopped && hasHandledWin && isAutoSpinEnabled) {
      const interval = hasWon ? 3000 : 500;
      setTimeout(() => {
        startSpinning();
      }, interval);
    }
  }, [columnStates, hasWon, hasHandledWin, isAutoSpinEnabled]);

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
                (isFirstReel &&
                  reelIconsMoved[reelIndex] >= minIconsToBeMoved) ||
                (previousReelStopped &&
                  reelIconsMoved[reelIndex] >=
                    reelIconsMoved[reelIndex - 1] + minIconsToBeMoved)
              ) {
                if (
                  newAssets[1].value === desiredNums![0][reelIndex] &&
                  newAssets[2].value === desiredNums![1][reelIndex] &&
                  newAssets[3].value === desiredNums![2][reelIndex]
                ) {
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
        requestAnimationFrame(move);
      })
      .start();
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
    betAmount,
    fixedBetAmounts,
    setBetAmount,
    startSpinning,
    balance,
    isButtonDisabled,
    handleBetAmountChange,
    openModal,
    closeModal,
    hasHandledWin,
    payoutsHandler,
    tempWinning,
    winningMatrix,
    isAutoSpinEnabled,
    setIsAutoSpinEnabled,
  };
};
