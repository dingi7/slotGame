// calculate the RTP value 

import { play } from "../operations/slotMachine/slotLogic.operation";

export function RTPtest() {
  const betAmount = 10;
  const totalSpins = 10000000;
  let totalPayout = 0;
  for (let i = 0; i < totalSpins; i++) {
    const [win, payout] = play(betAmount);
    totalPayout += payout;
  }
  const RTP = (totalPayout / totalSpins) * 100;
  console.log(`RTP: ${RTP}%`);
}

