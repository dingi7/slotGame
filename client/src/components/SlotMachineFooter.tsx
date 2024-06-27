import { RefreshCcw } from "lucide-react";

export const SlotMachineFooter = ({isMobile, balance, fixedBetAmounts, betAmount, setBetAmount, spinningColumns, startSpinning, lastWin, isButtonDisabled}:{
    isMobile: boolean;
    balance: number;
    fixedBetAmounts: number[];
    betAmount: number;
    setBetAmount: (x: number) => void;
    spinningColumns: boolean[];
    startSpinning: () => void;
    lastWin: number;
    isButtonDisabled: boolean;
}) => {
    return (
        <div
        className={`w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly ${
          isMobile ? "items-end" : "items-center"
        } select-none relative h-[15%]`}
      >
        <div>
          <p className="uppercase font-semibold">balance:</p>
          <p>{balance} BGN</p>
        </div>

        {!isMobile && (
          <div className=" flex flex-col gap-2 relative">
            <p className="uppercase text-xs text-slate-300 absolute -top-5 left-1/2 -translate-x-[50%]">
              please, place your bet
            </p>
            <div className={`flex flex-row gap-2 md:gap-4`}>
              {fixedBetAmounts.map((x) => (
                <div
                  className={`border-slate-200 border-2 px-4 py-2 rounded-md cursor-pointer shadow shadow-slate-500 text-sm md:text-base ${
                    betAmount === x
                      ? " bg-gradient-to-b from-green-500 to-green-800"
                      : "bg-stone-600"
                  }`}
                  onClick={() => setBetAmount(x)}
                >
                  <p className="flex gap-[2%]">
                    <span className="font-semibold">{x}</span>
                    <span>BGN</span>
                  </p>
                  <p className="text-yellow-300 uppercase">bet</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMobile && (
          <button
            className=" bg-stone-900/50 p-[2.5%]  h-full aspect-square flex justify-center items-center rounded-full border-2 border-slate-200 "
            //onClick={startSpinning}
            disabled={spinningColumns.some((x) => x === true)}
          >
            <RefreshCcw
              className={`opacity-100 ${
                spinningColumns.some((x) => x === true) ? "animate-spin" : ""
              } w-3/5 h-3/5`}
            />
          </button>
        )}

        {!isMobile && (
          <button
            className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200"
            onClick={() => {
              startSpinning();
            }}
            disabled={spinningColumns.some((x) => x === true) || isButtonDisabled}
          >
            <RefreshCcw
              className={`opacity-100 ${
                spinningColumns.some((x) => x === true) ? "animate-spin" : ""
              }`}
            />
          </button>
        )}

        <div className="uppercase">
          <p className="font-semibold">last win:</p>
          <p>{lastWin}</p>
        </div>
      </div>
    )
}