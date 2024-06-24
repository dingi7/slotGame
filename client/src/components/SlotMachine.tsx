import { AnimatedSprite, Sprite as ReactSprite, Stage } from "@pixi/react";
import { Assets, Texture } from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";

// Define asset URLs
const assets = [
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
];

export const SlotMachine = () => {
  const [loaded, setLoaded] = useState(false);
  const [textures, setTextures] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    Assets.load(assets).then((loadedTextures) => {
      setTextures(loadedTextures.map((texture: string) => Texture.from(texture)));
      setLoaded(true);
    });
  }, []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
        className=""
    >
      <AnimatedSprite
        anchor={0.5}
        textures={textures}
        isPlaying={true}
        initialFrame={0}
        animationSpeed={0.1}
      />
    </Stage>
  );
};

export default SlotMachine;
