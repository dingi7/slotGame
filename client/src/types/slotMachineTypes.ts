import * as PIXI from "pixi.js";

export type Asset = {
  image: string;
  value: number;
};

export type ReelStateType = {
  assets: Asset[];
  spinning: boolean;
  middleRowIndex: number;
};

export type Reels = [ReelStateType, ReelStateType, ReelStateType];
