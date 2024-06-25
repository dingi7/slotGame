import * as PIXI from "pixi.js";

import { Container, Graphics, Sprite, Stage } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

import { RefreshCcw } from "lucide-react";
import slotBackground from "../assets/slot-background.jpg";

// Define asset URLs
const assets = [
  "https://pixijs.com/assets/eggHead.png",
  "https://pixijs.com/assets/flowerTop.png",
  "https://pixijs.com/assets/helmlok.png",
  "https://pixijs.com/assets/skully.png",
];

export const SlotMachine: React.FC = () => {
  //const betInterval = 10;
  const fixedBetAmounts = [20, 40, 100, 200];
  const [betAmount, setBetAmount] = useState<number>(fixedBetAmounts[0]);

  
  const columns = 3;
  const rows = 3;

  const [assetsMatrix, setAssetsMatrix] = useState<string[][]>(
    Array.from({ length: columns }, () =>
      Array.from({ length: rows }, () => assets[Math.floor(Math.random() * assets.length)])
    )
  );
  const [spinning, setSpinning] = useState(false);
  const [positions, setPositions] = useState(Array(columns).fill(0));
  const ticker = useRef(new PIXI.Ticker());
  const spinSpeed = useRef(Array(columns).fill(0));
  const targetPositions = useRef(Array(columns).fill(0));

  const windowWidth = window.innerWidth;
  const slotHeight = windowWidth * 0.1;
  const totalHeight = windowWidth * 0.3;

  useEffect(() => {
    const handleTick = (delta: number) => {
      if (spinning) {
        setPositions((prevPositions) =>
          prevPositions.map((pos, index) => {
            const newPos = pos + spinSpeed.current[index] * delta;
            if (newPos >= targetPositions.current[index]) {
              spinSpeed.current[index] = 0;
              return snapToGrid(targetPositions.current[index]);
            }
            return newPos;
          })
        );

        if (spinSpeed.current.every(speed => speed === 0)) {
          setSpinning(false);
          setAssetsMatrix((prevMatrix) => realignMatrix(prevMatrix, positions));
        }
      }
    };

    const currentTicker = ticker.current;
    currentTicker.start();
    currentTicker.add((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));

    return () => {
      currentTicker.remove((ticker: PIXI.Ticker) => handleTick(ticker.deltaTime));
      currentTicker.stop();
    };
  }, [spinning]);

  const snapToGrid = (position: number) => {
    return Math.round(position / slotHeight) * slotHeight;
  };

  const realignMatrix = (matrix: string[][], positions: number[]) => {
    return matrix.map((column, colIndex) => {
      const offset = Math.floor(positions[colIndex] / slotHeight) % rows;
      return [...column.slice(offset), ...column.slice(0, offset)];
    });
  };

  const shuffleMatrix = () => {
    if (spinning) return;

    setSpinning(true);
    const newMatrix = assetsMatrix.map((column) =>
      column.map(() => assets[Math.floor(Math.random() * assets.length)])
    );
    setAssetsMatrix(newMatrix);

    spinSpeed.current = Array(columns).fill(0).map(() => Math.random() * 5 + 10);
    console.log(spinSpeed.current);
    targetPositions.current = positions.map(() => (Math.floor(Math.random() * 20 + 20)) * slotHeight);
    
    setPositions(Array(columns).fill(0));
  };


  //   const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const newValue = Number(e.target.value);

  //     if (isNaN(newValue) || !isFinite(newValue)) {
  //       return;
  //     }
  //     // Set the bet amount directly if the current state is 0
  //     if (betAmount === 0) {
  //       setBetAmount(newValue);
  //     } else {
  //       // You can implement additional logic here if needed
  //       setBetAmount(newValue);
  //     }
  //   };

  const drawRect = (graphics: PIXI.Graphics) => {
    const rectWidth =
      windowWidth >= 768 ? windowWidth * 0.09 : windowWidth * 0.32;
    const rectHeight =
      windowWidth >= 768 ? windowWidth * 0.3 : windowWidth * 0.8;
    graphics.clear();
    const padding = 0.1;
    graphics.lineStyle(3, 0x966304, 1);
    const fillColor = 0x08043c;
    graphics.beginFill(fillColor, 1);
    graphics.drawRoundedRect(
      -padding,
      -padding,
      rectWidth + padding * 2,
      rectHeight + padding * 2,
      5
    );
    graphics.endFill();
  };

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center gap-5 bg-[url(${slotBackground})] text-white overflow-hidden`}
      style={{ backgroundImage: `url(${slotBackground})` }}
    >
      <div className="flex gap-4 pt-[2%]">
        <p className="uppercase text-yellow-400 text-2xl font-semibold text-shadow-superhot">
          slot machine
        </p>
      </div>

      <div className="my-auto relative">
        <Stage
          options={{
            backgroundAlpha: 0,
          }}
          width={windowWidth >= 768 ? windowWidth * 0.31 : windowWidth * 0.9}
          height={windowWidth >= 768 ? windowWidth * 0.3 : windowWidth * 0.8}
        >
          {assetsMatrix.map((column, index) => (
            <Container
              x={
                windowWidth >= 768
                  ? index * windowWidth * 0.11
                  : index * windowWidth * 0.32
              }
            >
              <Graphics draw={(g: PIXI.Graphics) => drawRect(g)} />
              {column.map((asset, index) => (
                <Sprite
                  key={index}
                  image={asset}
                  y={
                    windowWidth >= 768
                      ? (index !== 0 ? index : 0.1) * windowWidth * 0.106
                      : (index !== 0 ? index : 0.1) * windowWidth * 0.27
                  }
                  x={
                    windowWidth >= 768
                      ? windowWidth * 0.005
                      : windowWidth * 0.004
                  }
                  width={
                    windowWidth >= 768 ? windowWidth * 0.08 : windowWidth * 0.26
                  }
                  height={
                    windowWidth >= 768 ? windowWidth * 0.08 : windowWidth * 0.26
                  }
                  filters={[]}
                />
              ))}
            </Container>
          ))}
        </Stage>
      </div>

      <div className="w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly items-center select-none">
        <div>
          <p className="uppercase">balance:</p>
          <p>5000 BGN</p>
        </div>
        {/* <div className="flex gap-4 text-2xl border-2 rounded-lg p-[0.2%]">
          <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tl-lg rounded-bl-lg shadow" onClick={() => setBetAmount(betAmount - betInterval)}>
            -
          </button>
          <div className="flex flex-col justify-center">
            <input
              className="text-xl bg-transparent text-center appearance-none"
              value={betAmount}
              onChange={handleBetAmountChange}
            />
            <p className="text-lg uppercase text-center">total bet</p>
          </div>
          <button className="border-slate-200 border-2 py-[8%] px-4 rounded-tr-lg rounded-br-lg shadow" onClick={() => setBetAmount(betAmount + betInterval)}>
            +
          </button>
        </div> */}

        <div className="flex flex-col gap-2">
            <p className="uppercase text-xs text-slate-300">please, place your bet </p>
          <div className="flex gap-4">
            {fixedBetAmounts.map((x) => (
              <div
                className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500  ${
                  betAmount === x
                    ? " bg-gradient-to-b from-green-500 to-green-800"
                    : "bg-stone-600"
                }`}
                onClick={() => setBetAmount(x)}
              >
                <p className="flex gap-[2%]">
                  <span className="font-semibold">{x}</span> <span>BGN</span>
                </p>
                <p className="text-yellow-300 uppercase">bet</p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="uppercase flex flex-col gap-4 border-2 px-[5%] rounded-b-[80%]">
          <p className="font-bold text-xl">0</p>
          <p>win</p>
        </div> */}

        {/* <button className="uppercase border-slate-200 border-2 p-2 rounded-lg">
          <span className="w-[20px] h-[20px]"></span>
          <p className="flex flex-col">
            <span>max </span>
            <span>bet</span>
          </p>
        </button> */}

        {/* <button onClick={shuffleMatrix} className="uppercase">
          <p>Spin</p>
          <p>hold for auto</p>
        </button> */}
        <button
          className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200"
          onClick={shuffleMatrix}
        >
          <RefreshCcw className="opacity-100" />
        </button>

        <div className="uppercase">
          <p>last win:</p>
          <p>0</p>
        </div>
      </div>
    </div>
  );
};
