import { useEffect, useRef, useState } from "react";

import { sendDoubleRequest } from "../../api/requests";

export const DoubleWinAmountModal = ({
  cards,
  isMobile,
  betAmmount,
}: {
  cards: string[];
  isMobile: boolean;
  betAmmount: number;
}) => {
  const [selectedCard, setSelectedCard] = useState<string>(cards[0]);
  const [hasHandled, setHasHandled] = useState<boolean>(false);

  const [choice, setChoice] = useState<string>();

  const toggleCard = () => {
    setSelectedCard((prevCard) => {
      const nextCard = prevCard === cards[0] ? cards[1] : cards[0];
      return nextCard;
    });
  };

  useEffect(() => {
    if (!hasHandled) {
      const interval = setInterval(toggleCard, 500);
      return () => clearInterval(interval);
    }
  }, [cards, hasHandled]);

  const handleSubmit = async (clickedChoice: number) => {
    const result = await sendDoubleRequest(10);
    setSelectedCard(cards[clickedChoice]);
    setHasHandled(true);
    console.log(result);
  };

  return (
    <div className="w-full md:w-2/5 h-4/5 md:h-2/3 shadow shadow-slate-200 rounded-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-55%] z-50 flex flex-col items-center justify-center bg-neutral-600/95 border-2 border-slate-200/30">
      <div className="uppercase flex justify-between w-full bg-neutral-700 rounded-xl">
        <div className="bg-neutral-800 rounded p-2">
          <p className="text-sm text-yellow-400 font-medium">doubling amount</p>
          <p className="flex gap-[2%] justify-center items-center">
            <span>{betAmmount.toFixed(2)}</span> <span>BGN</span>
          </p>
        </div>

        <p className="font-semibold pt-4">double win amount</p>

        <div className="bg-neutral-800 rounded-lg p-2">
          <p className="text-sm text-yellow-400 font-medium">
            potential win amount
          </p>
          <p className="flex gap-[2%] justify-center items-center">
            <span>{(betAmmount * 2).toFixed(2)}</span> <span>BGN</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col  w-[90%] h-5/6 m-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full h-3/5 md:h-5/6">
          <button
            className="bg-red-600 h-2/5 aspect-square rounded-full uppercase font-semibold  items-center justify-center border-2 border-slate-200/70 hidden md:flex"
            onClick={() => handleSubmit(0)}
          >
            <p>red</p>
          </button>
          <div className="h-4/5">
            <img src={selectedCard} className="w-full h-full object-cover" />
          </div>
          <button
            className="bg-neutral-800   h-2/5   aspect-square rounded-full uppercase font-semibold items-center justify-center border-2 border-slate-200/70 hidden md:flex"
            onClick={() => handleSubmit(1)}
            disabled={hasHandled}
          >
            <p>black</p>
          </button>
        </div>
        {isMobile && (
          <div className="flex w-4/5 m-auto h-full justify-between">
            <button
              className="bg-red-600 h-2/3  aspect-square rounded-full uppercase font-semibold  items-center justify-center border-2 border-slate-200/70 flex"
              onClick={() => handleSubmit(0)}
            >
              <p>red</p>
            </button>
            <button
              className="bg-neutral-800   h-2/3 aspect-square rounded-full uppercase font-semibold items-center justify-center border-2 border-slate-200/70 flex"
              onClick={() => handleSubmit(1)}
              disabled={hasHandled}
            >
              <p>black</p>
            </button>
          </div>
        )}
        <div>
          <p className="uppercase font-medium opacity-80">chose red or black</p>
        </div>
      </div>
    </div>
  );
};
