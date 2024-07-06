export type Asset = {
  image: string;
  key: number;
};

export type ReelStateType = {
  assets: Asset[];
  spinning: boolean;
};

export enum Payouts {
  none = 0
}

export type Reels = [ReelStateType, ReelStateType, ReelStateType];
