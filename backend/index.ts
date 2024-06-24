import { play } from "./operations/slotMachine/slotLogic.operation";

function simulate(plays: number, betAmount: number): number {
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

console.log(
  `Simulated ${plays} plays with a bet of ${betAmount} units per spin.`
);
console.log(`Return to Player (RTP): ${RTP.toFixed(2)}%`);
