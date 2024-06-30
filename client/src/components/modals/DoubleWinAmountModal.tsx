import { useEffect, useState } from "react";

import { sendDoubleRequest } from "../../api/requests";

import blackCard from "../../assets/blackCard.png";
import redCard from "../../assets/redCard.png";

import AceRed from "../../assets/AceRed.png"
import AceBlack from "../../assets/AceBlack.png"

export const DoubleWinAmountModal = ({
    betAmmount,
}: {
    betAmmount: number;
}) => {
    const cardBacks = [redCard, blackCard]
    const cardFront = [AceRed, AceBlack]
    const [selectedCard, setSelectedCard] = useState<string>(cardBacks[0]);
    const [hasHandled, setHasHandled] = useState<boolean>(false);


    const [choice, setChoice] = useState<string>();

    const toggleCard = () => {
        setSelectedCard((prevCard) => {
            const nextCard = prevCard === cardBacks[0] ? cardBacks[1] : cardBacks[0];
            return nextCard;
        });
    };

    useEffect(() => {
        if (!hasHandled) {
            const interval = setInterval(toggleCard, 500);
            return () => clearInterval(interval);
        }
    }, [cardBacks, hasHandled]);

    const handleSubmit = async (clickedChoice: number) => {
        const result = await sendDoubleRequest(10);
        setSelectedCard(cardBacks[clickedChoice]);
        setHasHandled(true);
        console.log(result);
    };

    return (
        <div className="w-full 2xl:w-2/5 lg:w-2/3 h-4/5 2xl:h-2/3 shadow shadow-slate-200 rounded-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-55%] z-50 flex flex-col items-center justify-center bg-neutral-600/95 border-2 border-slate-200/30">
            <div className="uppercase flex justify-between w-full bg-neutral-700 rounded-xl">
                <div className="bg-neutral-800 rounded p-2">
                    <p className="text-sm text-yellow-400 font-medium">
                        doubling amount
                    </p>
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
                        <span>{(betAmmount * 2).toFixed(2)}</span>{" "}
                        <span>BGN</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col  w-[90%] h-5/6 m-auto">
                <div className="flex flex-col 2xl:flex-row justify-between items-center w-full h-3/5 2xl:h-5/6">
                    <button
                        className="bg-red-600 h-2/5 aspect-square rounded-full uppercase font-semibold  items-center justify-center border-2 border-slate-200/70 hidden 2xl:flex"
                        onClick={() => handleSubmit(0)}
                        disabled={hasHandled}
                    >
                        <p>red</p>
                    </button>
                    <div className="h-4/5">
                        <img
                            src={selectedCard}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        className="bg-neutral-800   h-2/5 aspect-square rounded-full uppercase font-semibold items-center justify-center border-2 border-slate-200/70 hidden 2xl:flex"
                        onClick={() => handleSubmit(1)}
                        disabled={hasHandled}
                    >
                        <p>black</p>
                    </button>
                </div>

                <div className="flex 2xl:hidden w-4/5 m-auto h-fit justify-between ">
                    <button
                        className="bg-red-600  w-[30dvw] h-[30dvw] lg:w-[15dvw] lg:h-[15dvw]  aspect-square rounded-full uppercase font-semibold  items-center justify-center border-2 border-slate-200/70 flex"
                        onClick={() => handleSubmit(0)}
                        disabled={hasHandled}
                    >
                        <p>red</p>
                    </button>
                    <button
                        className="bg-neutral-800   w-[30dvw] h-[30dvw] lg:w-[15dvw] lg:h-[15dvw] rounded-full uppercase font-semibold items-center justify-center border-2 border-slate-200/70 flex"
                        onClick={() => handleSubmit(1)}
                        disabled={hasHandled}
                    >
                        <p>black</p>
                    </button>
                </div>

                <div>
                    <p className="uppercase font-medium opacity-80">
                        chose red or black
                    </p>
                </div>
            </div>
        </div>
    );
};
