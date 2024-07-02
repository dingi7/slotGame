// calculate the RTP value

import { play } from '../operations/slotMachine/slotLogic.operation';

export function RTPtest() {
    const betAmount = 10;
    const totalSpins = 100000;
    let totalPayout = 0;
    let totalWins = 0;
    for (let i = 0; i < totalSpins; i++) {
        const [win, payout] = play(betAmount);
        totalPayout += payout;
        if (win) {
            totalWins++;
        }
    }
    const RTP = (totalPayout / (totalSpins * betAmount)) * 100;
    const winPercentage = (totalWins / totalSpins) * 100;
    console.log(`RTP: ${RTP.toFixed(2)}%`);
    console.log(`Total Wins: ${totalWins} out of ${totalSpins} spins`);
    console.log(`Win Percentage: ${winPercentage.toFixed(2)}%`);
}
