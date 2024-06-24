import { Container, Sprite, Stage } from "@pixi/react";
import React, { useEffect, useState } from "react";

// Define asset URLs

export const SlotMachine = () => {
  const [assets, setAssets] = useState([
    "https://pixijs.com/assets/eggHead.png",
    "https://pixijs.com/assets/flowerTop.png",
    "https://pixijs.com/assets/helmlok.png",
    "https://pixijs.com/assets/skully.png",
  ]);

  const columns = 3;
  const [assetsMatrix, setAssetsMatrix] = useState<string[][]>(
    Array.from({ length: columns }, () => [])
  );

  useEffect(() => {
    // Initialize a new matrix
    const matrix: string[][] = Array.from({ length: columns }, () => []);

    // Duplicate assets across columns
    assets.forEach((asset) => {
      for (let i = 0; i < columns; i++) {
        matrix[i].push(asset);
      }
    });

    // Set the state with the newly created matrix
    setAssetsMatrix(matrix);
  }, [assets, columns]);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div>
        <p className="flex gap-[5%]">
          <span className="w-fit">Mega Jackpot</span> <span>77777</span>
        </p>
      </div>
      <div>
        <Stage
          options={{ background: 0xfffff }}
          width={windowWidth * 0.4}
          height={windowWidth * 0.3}
        >
          {assetsMatrix.map((column, index) => (
            <Container x={index * windowWidth * 0.15}>
              {column.map((asset, index) => (
                <Sprite
                  key={index}
                  image={asset}
                  y={index * windowWidth * 0.1}
                  width={windowWidth * 0.1}
                  height={windowWidth * 0.1}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-4 text-2xl">
          <button>-</button>
          
          <p className="flex flex-col">
            <span>500</span>
            <span>total bet</span>
          </p>
          
          <button>+</button>
        </div>

        <button>Spin</button>
      </div>
    </div>
  );
};
