import { Reels, ReelStateType } from "../types/slotMachineTypes";
import { assets } from "../assets/reelAssets";

const rowsPerReel = 3;

export const shuffleArray = (array: any[]): any[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const defaultState = (): ReelStateType => ({
  assets: shuffleArray([...assets]),
  spinning: false,
  middleRowIndex: Math.floor(rowsPerReel / 2),
});

export const initializeAssetsMatrix = (): Reels => {
  const columnStates: Reels = [defaultState(), defaultState(), defaultState()];

  return columnStates;
};
