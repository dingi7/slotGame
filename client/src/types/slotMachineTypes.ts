export type Asset = {
  image: string;
  key: number;
};

export type ReelStateType = {
  assets: Asset[];
  spinning: boolean;
};

export type Reels = [ReelStateType, ReelStateType, ReelStateType];
