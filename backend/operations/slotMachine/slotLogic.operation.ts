import { payouts, GameSymbol, Reel, Slot, Slot3x3 } from './payouts.model';

const reel1: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel2: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel3: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const reels: Reel[] = [reel1, reel2, reel3];

function spinReel(reel: Reel): GameSymbol {
    const randIndex = Math.floor(Math.random() * reel.length);
    return reel[randIndex];
}

function spin(): Slot3x3 {
    return [
        spinReel(reels[0]),
        spinReel(reels[1]),
        spinReel(reels[2]),
        spinReel(reels[0]),
        spinReel(reels[1]),
        spinReel(reels[2]),
        spinReel(reels[0]),
        spinReel(reels[1]),
        spinReel(reels[2]),
    ];
}

function calculatePayout(result: Slot3x3, betAmount: number): number {
    const combination = result.join('');
    let payout = 0;

    if (combination === '777') {
        payout = payouts['777'];
    } else if (combination.includes('77')) {
        payout = payouts['77'];
    } else if (combination.includes('7')) {
        payout = payouts['7'];
    } else if (payouts[combination] !== undefined) {
        payout = payouts[combination];
    }

    return payout * betAmount; // Adjusting to get approximately 96% RTP
}

export function play(betAmount: number): [boolean, number, Slot3x3] {
    const result = spin();
    const payout = calculatePayout(result, betAmount);
    let win = payout > 0 ? true : false;
    return [win, payout, result];
}

export function doubleOrNothing(betAmount: number): [boolean, number] {
    const result = Math.random() < 0.5 ? true : false;
    const payout = result ? betAmount * 2 : 0;
    return [result, payout];
}
