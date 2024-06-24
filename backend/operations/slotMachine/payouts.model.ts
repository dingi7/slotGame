type Payouts = {
  [key: string]: number;
};

export type GameSymbol =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
export type Reel = GameSymbol[];

export type Slot = [GameSymbol, GameSymbol, GameSymbol];

export const payouts: Payouts = {
  "000": 1,
  "111": 1,
  "222": 1,
  "333": 1,
  "444": 1,
  "555": 1,
  "666": 1,
  "777": 100,
  "888": 1,
  "999": 1,
  "77": 5,
  "7": 3,
};
