import { Howl } from 'howler';
import columnStopSound from "../assets/column.wav"
import spinningSound from "../assets/spinning.wav";
import winSound from "../assets/win.wav";

// Create separate Howl instances for each sound
let spinningSoundInstance: Howl | null = null;
let columnStopSoundInstance: Howl | null = null;
let winSoundInstance: Howl | null = null;

export enum SoundTypes {
  win = 'win',
  spinning = 'spinning',
  columnStop = 'columnStop'
}

export const playSound = (type: SoundTypes) => {
  if (type === SoundTypes.spinning) {
    if (spinningSoundInstance) {
      spinningSoundInstance.stop();
    }
    spinningSoundInstance = new Howl({
      src: [spinningSound],
      loop: true, // loop the spinning sound
    });
    spinningSoundInstance.play();
  } else if (type === SoundTypes.columnStop) {
    if (columnStopSoundInstance) {
      columnStopSoundInstance.stop();
    }
    columnStopSoundInstance = new Howl({
      src: [columnStopSound],
    });
    columnStopSoundInstance.play();
  } else if (type === SoundTypes.win) {
    if (winSoundInstance) {
      winSoundInstance.stop();
    }
    winSoundInstance = new Howl({
      src: [winSound],
    });
    winSoundInstance.play();
  }
};

export const stopSound = (type?: SoundTypes) => {
  if (!type) {
    if (spinningSoundInstance) {
      spinningSoundInstance.stop();
    }
    if (columnStopSoundInstance) {
      columnStopSoundInstance.stop();
    }
    if (winSoundInstance) {
      winSoundInstance.stop();
    }
  } else if (type === SoundTypes.spinning && spinningSoundInstance) {
    spinningSoundInstance.stop();
  } else if (type === SoundTypes.columnStop && columnStopSoundInstance) {
    columnStopSoundInstance.stop();
  } else if (type === SoundTypes.win && winSoundInstance) {
    winSoundInstance.stop();
  }
};
