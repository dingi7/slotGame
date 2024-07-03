import { createLines, updateWinningMatrix } from '../../util/paylineHelpers';
import { payouts, GameSymbol, Reel, Slot3x3 } from './payouts.model';

const reelSymbols: Reel = ['1', '2', '3', '4', '5', '6', '7', '8'];

const reel1: Reel = [...reelSymbols, ...reelSymbols, ...reelSymbols];
const reel2: Reel = [...reelSymbols, ...reelSymbols, ...reelSymbols];
const reel3: Reel = [...reelSymbols, ...reelSymbols, ...reelSymbols];

const reels: Reel[] = [reel1, reel2, reel3];

function spinReel(reel: Reel): GameSymbol {
    const randIndex = Math.floor(Math.random() * reel.length);
    return reel[randIndex];
}

function spin(): Slot3x3 {
    return {
        row1: [spinReel(reels[0]), spinReel(reels[1]), spinReel(reels[2])],
        row2: [spinReel(reels[0]), spinReel(reels[1]), spinReel(reels[2])],
        row3: [spinReel(reels[0]), spinReel(reels[1]), spinReel(reels[2])],
    };
}

function findHighestPayout(lines: string[], payouts: any): [number, number] {
    let maxPayout = 0;
    let winningLineIndex = -1;

    lines.forEach((combination, index) => {
        if (payouts[combination] !== undefined) {
            const currentPayout = payouts[combination];
            if (currentPayout > maxPayout) {
                maxPayout = currentPayout;
                winningLineIndex = index;
            }
        }
    });

    return [maxPayout, winningLineIndex];
}

function calculatePayout(
    result: Slot3x3,
    betAmount: number
): [number, boolean[][]] {
    const lines = createLines(result);
    const [maxPayout, winningLineIndex] = findHighestPayout(lines, payouts);

    const payout = maxPayout * betAmount;
    const winningMatrix = updateWinningMatrix(winningLineIndex);

    return [payout, winningMatrix];
}

export function play(
    betAmount: number
): [boolean, number, Slot3x3, boolean[][]] {
    const result = spin();
    const [payout, winningMatrix] = calculatePayout(result, betAmount); 
    let win = payout > 0 ? true : false;
    return [win, payout, result, winningMatrix];
}

export function doubleOrNothing(betAmount: number): [boolean, number] {
    const result = Math.random() < 0.5 ? true : false;
    const payout = result ? betAmount * 2 : 0;
    return [result, payout];
}
