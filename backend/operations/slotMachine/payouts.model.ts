type Payouts = {
    [key: string]: number;
};

export type GameSymbol = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type Reel = GameSymbol[];

export type Slot3x3 = {
    row1: [GameSymbol, GameSymbol, GameSymbol];
    row2: [GameSymbol, GameSymbol, GameSymbol];
    row3: [GameSymbol, GameSymbol, GameSymbol];
};

export const payouts: Payouts = {
    '111': 1,
    '222': 2,
    '333': 5,
    '444': 4,
    '555': 5,
    '666': 6,
    '777': 30,
    '888': 8,
};
