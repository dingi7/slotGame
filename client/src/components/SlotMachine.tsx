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



  return (
    <div>
      <Stage options={{ background: 0xffffff }}>
        {assetsMatrix.map((column, index) => (
          <Container x={index * 120}>
            {column.map((asset, index) => (
              <Sprite key={index} image={asset} y={index * 120} />
            ))}
          </Container>
        ))}
      </Stage>
      <button>Click</button>
    </div>
  );
};
