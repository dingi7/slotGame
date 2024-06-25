import { Howl } from 'howler';

let sound: Howl | null = null;

export const playSound = (soundFile: string) => {
  if (sound) {
    sound.stop();
  }
  sound = new Howl({
    src: [soundFile],
  });
  sound.play();
};

export const stopSound = () => {
  if (sound) {
    sound.stop();
  }
};
