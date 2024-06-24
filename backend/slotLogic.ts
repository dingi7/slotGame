type GameSymbol = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Reel = GameSymbol[];

const reel1: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel2: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const reel3: Reel = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const reels: Reel[] = [reel1, reel2, reel3];

type Payouts = {
    [key: string]: number;
};

const payouts: Payouts = {
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

function spinReel(reel: Reel): GameSymbol {
    const randIndex = Math.floor(Math.random() * reel.length);
    return reel[randIndex];
}

function spin(): [GameSymbol, GameSymbol, GameSymbol] {
    return [spinReel(reels[0]), spinReel(reels[1]), spinReel(reels[2])];
}

function calculatePayout(result: [GameSymbol, GameSymbol, GameSymbol], betAmount: number): number {
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

    // return payout * betAmount * 0.096; // Adjusting to get approximately 96% RTP
    return payout * betAmount; // Adjusting to get approximately 96% RTP

}

export function play(betAmount: number): [number, [GameSymbol, GameSymbol, GameSymbol]] {
    const result = spin();
    const payout = calculatePayout(result, betAmount);
    console.log(`Spin result: ${result.join(' ')} - Payout: ${payout}`);
    return [payout, result];
}


