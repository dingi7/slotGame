import { ArrowDownFromLine, Landmark, RefreshCcw } from "lucide-react";

import { MutableRefObject } from "react";
import OptionsModal from "./modals/OptionsModal";
import useLongPress from "../hooks/useLongPress";

export const SlotMachineFooter = ({
  isMobile,
  balance,
  fixedBetAmounts,
  betAmount,
  setBetAmount,
  spinningColumns,
  startSpinning,
  lastWin,
  isButtonDisabled,
  handleBetAmountChange,
  openDoubleWinAmountModal,
  openOptionsModal,
  hasWon,
  closeOptionsModal,
  isOptionsModalOpen,
  payoutsHandler,
  tempWinning,
  isAutoSpinEnabled,
  setIsAutoSpinEnabled,
  autoSpinIntervalRef,
}: {
  isMobile: boolean;
  balance: number;
  fixedBetAmounts: number[];
  betAmount: number;
  setBetAmount: (x: number) => void;
  spinningColumns: boolean[];
  startSpinning: () => void;
  lastWin: number;
  isButtonDisabled: boolean;
  handleBetAmountChange: (number: number) => void;
  openDoubleWinAmountModal: () => void;
  hasWon: boolean;
  openOptionsModal: () => void;
  closeOptionsModal: () => void;
  isOptionsModalOpen: boolean;
  payoutsHandler: (amount: number) => void;
  tempWinning: number;
  isAutoSpinEnabled: boolean;
  setIsAutoSpinEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  autoSpinIntervalRef: MutableRefObject<number | null>;
}) => {
  const onShortClick = () => {
    if (isAutoSpinEnabled) {
      setIsAutoSpinEnabled(false);
      if (autoSpinIntervalRef.current) {
        clearTimeout(autoSpinIntervalRef.current);
      }
      return;
    }
    if (!hasWon) {
      startSpinning();
      return;
    }
    if (hasWon && !isAutoSpinEnabled) {
      payoutsHandler(tempWinning);
      return;
    }
  };

  const backspaceLongPress = useLongPress(
    () => {
      setIsAutoSpinEnabled(true);
    },
    1000,
    onShortClick
  );

  return (
    <div
      className={` select-none relative h-[17%] bg-gradient-to-t w-full from-black via-black/50 to-transparent`}
    >
      <div
        className={`w-full md:w-[60%] mx-auto mb-0 mt-auto pb-4 flex  justify-evenly ${
          isMobile ? "items-end" : "items-center"
        } select-none relative h-full`}
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
        <button
          className=" bg-stone-900/50 p-[2.5%] rounded-full border-2 border-slate-200 "
          onClick={openOptionsModal}
        >
          <Landmark />
        </button>
        <OptionsModal
          closeModal={closeOptionsModal}
          isOpen={isOptionsModalOpen}
          handleBetAmountChange={handleBetAmountChange}
        />

        {isMobile && (
          <button
            className="flex justify-center items-center bg-stone-900/50 p-[1%] rounded-full border-2 border-slate-200 h-full aspect-square"
            {...backspaceLongPress}
            disabled={
              spinningColumns.some((x) => x === true) && !isAutoSpinEnabled
            }
          >
            {!hasWon || spinningColumns.some((x) => x === true) ? (
              <RefreshCcw
                className={`opacity-100 ${
                  spinningColumns.some((x) => x === true) || isAutoSpinEnabled
                    ? "animate-spin"
                    : ""
                }`}
              />
            ) : (
              <ArrowDownFromLine />
            )}
          </button>
        )}
        {!isMobile && (
          <div className="flex flex-col  h-full gap-[1%] relative min-w-[15%]">
            <div className="flex justify-between items-center h-full gap-[4%] pb-[12%] pl-[20%]">
              <button
                className="flex justify-center items-center bg-stone-900/50 p-[1%] rounded-full border-2 border-slate-200 h-full aspect-square"
                {...backspaceLongPress}
                disabled={
                  spinningColumns.some((x) => x === true) && !isAutoSpinEnabled
                }
              >
                {!hasWon || spinningColumns.some((x) => x === true) ? (
                  <RefreshCcw
                    className={`opacity-100 ${
                      spinningColumns.some((x) => x === true) ||
                      isAutoSpinEnabled
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                ) : (
                  <ArrowDownFromLine />
                )}
              </button>

              {hasWon &&
                !spinningColumns.some((x) => x === true) &&
                !isAutoSpinEnabled && (
                  <button
                    className="flex justify-center items-center bg-stone-900/50 p-[1%] rounded-full border-2 border-slate-200 h-2/3 aspect-square"
                    onClick={openDoubleWinAmountModal}
                    disabled={
                      spinningColumns.some((x) => x === true) ||
                      isButtonDisabled
                    }
                  >
                    <p className="flex items-baseline gap-[10%] font-semibold">
                      <span className="text-base">X</span>
                      <span className="text-2xl">2</span>
                    </p>
                  </button>
                )}
            </div>
            <p className="text-neutral-300/50 absolute bottom-0 left-0 w-full text-nowrap">
              hold for auto spin
            </p>
          </div>
        )}
        <div className="uppercase">
          <p className="font-semibold">last win:</p>
          <p>{lastWin}</p>
        </div>
      </div>
    </div>
  );
};
