import { Asset, ReelStateType, Reels } from "../types/slotMachineTypes";

import { assets } from "../assets/reelAssets";

export const shuffleArray = (array: Asset[]): Asset[] => {
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
  const columnStates: Reels = [defaultState(), defaultState(), defaultState()];

  return columnStates;
};

export const SetDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));