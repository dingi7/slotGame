import { Howl } from 'howler';

export const playSound = (soundFile: string) => {
  const sound = new Howl({
    src: [soundFile],
  });
  sound.play();
};