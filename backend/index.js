"use strict";
const reel1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel2 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reels = [reel1, reel2, reel3];
const payouts = {
    '000': 1,
    '111': 1,
    '222': 1,
    '333': 1,
    '444': 1,
    '555': 1,
    '666': 1,
    '777': 100,
    '888': 1,
    '999': 1,
    '77': 5,
    '7': 3
};
function spinReel(reel) {
    const randIndex = Math.floor(Math.random() * reel.length);
    return reel[randIndex];
}
function spin() {
    return [spinReel(reels[0]), spinReel(reels[1]), spinReel(reels[2])];
}
function calculatePayout(result, betAmount) {
    const combination = result.join('');
    let payout = 0;
    if (combination === '777') {
        payout = payouts['777'];
    }
    else if (combination.includes('77')) {
        payout = payouts['77'];
    }
    else if (combination.includes('7')) {
        payout = payouts['7'];
    }
    else if (payouts[combination] !== undefined) {
        payout = payouts[combination];
    }
    // return payout * betAmount * 0.096; // Adjusting to get approximately 96% RTP
    return payout * betAmount; // Adjusting to get approximately 96% RTP
}
function play(betAmount) {
    const result = spin();
    const payout = calculatePayout(result, betAmount);
    console.log(`Spin result: ${result.join(' ')} - Payout: ${payout}`);
    return [payout, result];
}
function simulate(plays, betAmount) {
    let totalBet = 0;
    let totalPayout = 0;
    for (let i = 0; i < plays; i++) {
        totalBet += betAmount;
        const [payout, result] = play(betAmount);
        totalPayout += Number(payout);
    }
    const RTP = (totalPayout / totalBet) * 100;
    console.log(`Total Bet: ${totalBet} - Total Payout: ${totalPayout}`);
    console.log(Number(totalBet) - Number(totalPayout));
    return RTP;
}
// Simulate 500,000 plays with a bet amount of 10 units
const plays = 100000;
const betAmount = 10;
const RTP = simulate(plays, betAmount);
console.log(`Simulated ${plays} plays with a bet of ${betAmount} units per spin.`);
console.log(`Return to Player (RTP): ${RTP.toFixed(2)}%`);
