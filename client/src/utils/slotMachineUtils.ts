import * as PIXI from 'pixi.js';

import { ColumnStateType } from "../types/slotMachineTypes";
import { assets } from "../assets/reelAssets";
import { useRef } from "react";

export const shuffleArray = (array: any[]): any[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  export const initializeAssetsMatrix = (): ColumnStateType[] => {
    const columns = 3;
    const rows = 3;
    const columnStates: ColumnStateType[] = Array.from({ length: columns }, () => ({
      assets: shuffleArray([...assets]),
      spinning: false,
      middleRowIndex: Math.floor(rows / 2),
    }));
  
    return columnStates;
  };
  