import * as PIXI from "pixi.js";

import {
  Asset,
  Payouts,
  ReelStateType,
  Reels,
} from "../types/slotMachineTypes";
import { SoundTypes, playSound, stopSound } from "../utils/soundPlayer";
import { useEffect, useRef, useState } from "react";

import { ModalState } from "./useModal";
import { ModalTypes } from "./useModal";
import { assets } from "../assets/reelAssets";
import { initializeAssetsMatrix } from "../utils/slotMachineUtils";
import { sendSpinRequest } from "../api/requests";

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
  const btnDissableDuration = 200;
  const minSpinTimes = 10;
  const minIconsToBeMoved = 3;
  const isMobile = windowWidth <= 768;
  const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
  const totalHeight = slotHeight * 3;
  const [spinIntervalDuration] = useState(60);
  const [isAutoSpinEnabled, setIsAutoSpinEnabled] = useState<boolean>(false);
  const autoSpinIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const betOptions: { [key: number]: number[] } = {
    1: [1, 2, 3, 4, 5],
    2: [5, 10, 15, 20, 25],
    3: [10, 20, 30, 40, 50],
    4: [20, 40, 60, 80, 100],
  };
  const [fixedBetAmounts, setFixedBetAmounts] = useState<number[]>(
    betOptions[1]
  );

  const [betAmount, setBetAmount] = useState(fixedBetAmounts[0]);
  const [spinningReels, setSpinningReels] = useState(Array(3).fill(false));
  const [reelStates, setReelStates] = useState<Reels>(initializeAssetsMatrix);
  const [positions, setPositions] = useState(Array(columnsCount).fill(0));
  const [showLine, setShowLine] = useState(false);

  const [balance, setBalance] = useState(5000);
  const [lastWin, setLastWin] = useState(0);
  const [desiredIconsKey, setDesiredIconsKey] = useState<number[][]>();
  const [tempWinning, setTempWinning] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  //const [hasHandledWin, setHasHandledWin] = useState<boolean>(true);

  const [winningMatrix, setWinningMatrix] = useState<boolean[][]>([]);

  const tickers: PIXI.Ticker[] = Array(columnsCount).fill(new PIXI.Ticker());
  const handleBetAmountChange = (betOption: number) => {
    setFixedBetAmounts(betOptions[betOption]);
  };
  useEffect(() => {
    if (!desiredIconsKey) {
      return;
    }

    setReelStates((prevState) => {
      // Create a copy of the previous state to avoid direct mutation
      const newReelState: Reels = [
        { ...prevState[0], assets: [...prevState[0].assets] },
        { ...prevState[1], assets: [...prevState[1].assets] },
        { ...prevState[2], assets: [...prevState[2].assets] },
      ];

      // Push the desired symbols back to the end of the respective column's assets array
      for (let reel = 0; reel < columnsCount; reel++) {
        for (let row = 0; row < rowsCount; row++) {
          const desiredIconKey = desiredIconsKey[row][reel];
          // Assuming you have an `Asset` constructor or factory function to create an Asset object
          const desiredIcon = assets.find(
            (x: Asset) => x.key === desiredIconKey
          );
          if (desiredIcon) {
            newReelState[reel].assets.push(desiredIcon);
          }
        }
      }

      return newReelState;
    });
  }, [desiredIconsKey]);

  const [reelIconsMoved, setReelIcons] = useState(Array(columnsCount).fill(0));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSpinRequest = async () => {
    const result = await sendSpinRequest(betAmount);
    setBalance((prevBalance) => prevBalance - betAmount);
    setDesiredIconsKey(
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
    if (hasWon) {
      if (amount !== Payouts.none) {
        setBalance((prevBalance) => prevBalance + amount);
        setLastWin(amount);
      }

      //setHasHandledWin(true);
      setHasWon(false);
    }
  };

  const startSpinning = async () => {
    setHasWon(false);
    //setHasHandledWin(true);
    closeModal();
    if (balance - betAmount < 0) {
      openModal(ModalTypes.InsufficientFunds);
      return;
    }
    stopSound();
    setReelStates((prevState: Reels) => [
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

    playSound(SoundTypes.spinning);
    setReelStates(
      (prevStates) =>
        prevStates.map((state) => ({
          ...state,
          spinning: true,
        })) as Reels
    );
    setSpinningReels(Array(columnsCount).fill(true));
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
    const intervalId = setInterval(() => {
      setShowLine((prevShowLine) => !prevShowLine);
    }, intervalDuration);

    setTimeout(() => {
      clearInterval(intervalId);
      setShowLine(false);
    }, totalDuration);
  };

  useEffect(() => {
    const allStopped = reelStates.every((column) => column.spinning === false);
    if (!allStopped) {
      return;
    }

    stopSound(SoundTypes.spinning);
    if (hasWon) {
      setIsButtonDisabled(true);
      playSound(SoundTypes.win);

      toggleLine();
    }

    if (isAutoSpinEnabled) {
      autoSpinIntervalRef.current = setTimeout(
        () => {
          if (hasWon) {
            payoutsHandler(tempWinning);
            setHasWon(false);
          }
          startSpinning();
        },
        hasWon ? 3000 : 500
      );
    }
  }, [reelStates, hasWon, isAutoSpinEnabled]);

  useEffect(() => {
    if (spinningReels.some((spinning) => spinning)) {
      const interval = setInterval(() => {
        resetColumnPositions();
        setReelStates(
          (prevStates: Reels) =>
            prevStates.map((column: ReelStateType, reelIndex: number) => {
              if (!column.spinning) return column;

              const nextIcons = [...column.assets];
              const lastElement = nextIcons.pop();
              if (lastElement) {
                nextIcons.unshift(lastElement);
                handleSpinning(reelIndex);
              }

              if (reelIconsMoved[reelIndex] < minSpinTimes) {
                moveReelIcon(reelIndex as ReelIndex);
                return { ...column, assets: nextIcons };
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
                  nextIcons[1].key === desiredIconsKey![0][reelIndex] &&
                  nextIcons[2].key === desiredIconsKey![1][reelIndex] &&
                  nextIcons[3].key === desiredIconsKey![2][reelIndex]
                ) {
                  setSpinningReels((prev) => {
                    const newSpinningReels = [...prev];
                    newSpinningReels[reelIndex] = false;
                    tickers[reelIndex].stop();
                    stopSound(SoundTypes.spinning);
                    playSound(SoundTypes.columnStop);
                    playSound(SoundTypes.spinning);
                    setReelIcons(Array(columnsCount).fill(0));
                    return newSpinningReels;
                  });
                  return {
                    ...column,
                    assets: nextIcons,
                    spinning: false,
                  };
                }
              }

              moveReelIcon(reelIndex as ReelIndex);

              return { ...column, assets: nextIcons };
            }) as Reels
        );
      }, spinIntervalDuration);

      return () => clearInterval(interval);
    }
  }, [spinningReels, desiredIconsKey, reelIconsMoved]);

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
    reelStates,
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
    hasWon,
    payoutsHandler,
    tempWinning,
    winningMatrix,
    isAutoSpinEnabled,
    setIsAutoSpinEnabled,
    autoSpinIntervalRef,
  };
};
