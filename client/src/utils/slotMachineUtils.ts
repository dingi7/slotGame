import { Asset, ReelStateType, Reels } from "../types/slotMachineTypes";

import { assets } from "../assets/reelAssets";

const rowsPerReel = 3;

export const shuffleArray = (array: Asset[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const defaultState = (): ReelStateType => ({
  assets: shuffleArray([...assets]),
  spinning: false,
});

export const initializeAssetsMatrix = (): Reels => {
  const reelStates: Reels = [defaultState(), defaultState(), defaultState()];

  return reelStates;
};
