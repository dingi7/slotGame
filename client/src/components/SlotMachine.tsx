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
        setAssetsMatrix(matrix);
    }, [assets, columns]);

    const shuffleMatrix = () => {
    setAssetsMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((column) => {
        const shuffledColumn = [...column];
        for (let i = shuffledColumn.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledColumn[i], shuffledColumn[j]] = [shuffledColumn[j], shuffledColumn[i]];
        }
        return shuffledColumn;
      });
      return newMatrix;
    });
  };

    const windowWidth = window.innerWidth;
  
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <div>
                <p className="flex gap-[5%]">
                    <span className="w-fit">Mega Jackpot</span>{" "}
                    <span>77777</span>
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

            <div className="w-full flex gap-[10%] justify-center items-center">
                <div className="flex gap-4 text-2xl">
                    <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tl-lg rounded-bl-lg">
  -
                    </button>
          <div className="flex flex-col justify-center">
                        <p className="text-2xl">500</p>
                        <p className="text-xl uppercase text-center">total bet</p>
                    </div>
          <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tr-lg rounded-br-lg">
  +
                    </button>
        </div>

        <div className="uppercase flex flex-col gap-4">
          <p>0</p>
          <p>win</p>
                </div>

                <button onClick={shuffleMatrix} className="uppercase">
          <p>Spin</p>
          <p>hold for auto</p>
        </button>
            </div>
        </div>
    );
};
