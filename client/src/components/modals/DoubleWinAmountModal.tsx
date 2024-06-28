import { useEffect, useState } from "react";

import blackCard from "../../assets/blackCard.png";
import redCard from "../../assets/redCard.png";

export const DoubleWinAmountModal = () => {
  const [selectedCard, setSelectedCard] = useState<string>(redCard);
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCard((prevCard) =>
        prevCard === redCard ? blackCard : redCard
      );
    }, 210);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);
  return (
    <div className="w-2/5 h-2/3 shadow shadow-slate-200 rounded-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-50 flex flex-col items-center justify-center bg-neutral-600/95 border-2 border-slate-200/30">
      <div className="uppercase flex justify-between w-full bg-neutral-700 rounded-xl">
        <div className="bg-neutral-800 rounded p-2">
          <p className="text-sm text-yellow-400 font-medium">doubling amount</p>
          <p>1</p>
        </div>

        <p className="font-semibold pt-4">double win amount</p>

        <div className="bg-neutral-800 rounded-lg p-2">
          <p className="text-sm text-yellow-400 font-medium">
            potential win amount
          </p>
          <p>2</p>
        </div>
      </div>

      <div className="flex flex-col  w-[90%] h-5/6 m-auto">
        <div className="flex justify-between items-center w-full h-5/6">
          <button className="bg-red-600 h-2/5 aspect-square rounded-full uppercase font-semibold flex items-center justify-center border-2 border-slate-200/70">
            <p>red</p>
          </button>
          <div className="h-4/5">
            <img src={selectedCard} className="w-full h-full object-cover" />
          </div>
          <button className="bg-neutral-800  h-2/5   aspect-square rounded-full uppercase font-semibold flex items-center justify-center border-2 border-slate-200/70">
            <p>black</p>
          </button>
        </div>
        <div>
          <p className="uppercase font-medium opacity-80">chose red or black</p>
        </div>
      </div>
    </div>
  );
};
