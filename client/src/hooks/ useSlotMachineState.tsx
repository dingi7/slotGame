import { useState, useEffect } from 'react';
import { sendSpinRequest } from '../api/requests';
import { playSound, stopSound } from '../utils/soundPlayer';
import spinningSound from '../assets/spinning.wav';
import winSound from '../assets/win.wav';
import { initializeAssetsMatrix } from '../utils/slotMachineUtils';

export const useSlotMachineState = () => {
    const fixedBetAmounts = [20, 40, 100, 200];
    const [betAmount, setBetAmount] = useState(fixedBetAmounts[0]);
    const [spinningColumns, setSpinningColumns] = useState(
        Array(3).fill(false)
    );
    const [columnStates, setColumnStates] = useState(initializeAssetsMatrix);
    const [positions] = useState(Array(3).fill(0));
    const [showLine, setShowLine] = useState(false);
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;
    const slotHeight = windowWidth * 0.1 * (isMobile ? 2 : 1);
    const totalHeight = slotHeight * 3;
    const [balance, setBalance] = useState(5000);
    const [lastWin, setLastWin] = useState(0);
    const [desiredNums, setDesiredNums] = useState<number[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            // Show modal after 1 second for better UX
            setTimeout(() => {
                setIsModalOpen(true);
            }, 1000);
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
                        if (!column.spinning) return column;
                        const newAssets = [...column.assets];
                        const lastElement = newAssets.pop();
                        if (lastElement) {
                            newAssets.unshift(lastElement);
                        }
                        if (newAssets[1].value === desiredNums![colIndex]) {
                            setSpinningColumns((prev) => {
                                const newSpinningColumns = [...prev];
                                newSpinningColumns[colIndex] = false;
                                return newSpinningColumns;
                            });
                            return {
                                ...column,
                                assets: newAssets,
                                spinning: false,
                            };
                        }
                        return { ...column, assets: newAssets };
                    })
                );
            }, 100);

            return () => clearInterval(interval);
        }
    }, [spinningColumns, desiredNums]);

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
