import useModal, { ModalTypes } from "../hooks/useModal";

import { DoubleWinAmountModal } from "./modals/DoubleWinAmountModal";
import { InsufficientFundsModal } from "./modals/InsufficientFundsModal";
import { SlotMachineCanvas } from "./SlotMachineCanvas";
import { SlotMachineFooter } from "./SlotMachineFooter";
import slotBackground from "../assets/background.png";
import { useSlotMachine } from "../hooks/useSlotMachineState";

export const SlotMachine: React.FC = () => {
  const { isModalOpen, closeModal, openModal } = useModal();
  const {
    isMobile,
    windowWidth,
    slotHeight,
    totalHeight,
    reelStates,
    spinningReels,
    positions,
    showLine,
    lastWin,
    betAmount,
    fixedBetAmounts,
    setBetAmount,
    startSpinning,
    balance,
    isButtonDisabled,
    handleBetAmountChange,
    hasWon,
    payoutsHandler,
    tempWinning,
    winningMatrix,
    isAutoSpinEnabled,
    setIsAutoSpinEnabled,
    autoSpinIntervalRef
  } = useSlotMachine({ closeModal, openModal });

  return (
    <div
      className={`w-full h-full flex flex-col justify-center items-center gap-5 bg-[url(${slotBackground})] ${
        isMobile && "bg-cover"
      } text-white overflow-hidden`}
      style={{ backgroundImage: `url(${slotBackground})` }}
    >
      {isModalOpen.insufficientFunds && <InsufficientFundsModal />}
      {/* {isModalOpen.doubleWinAmountModal && <DoubleWinAmountModal cards={[redCard, blackCard]} betAmmount={betAmount}/>} */}
      {isModalOpen.doubleWinAmountModal && (
        <DoubleWinAmountModal
          betAmmount={tempWinning}
          payoutsHandler={payoutsHandler}
          closeModal={() => closeModal(ModalTypes.DoubleWinAmountModal)}
        />
      )}

      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex gap-4 pt-[2%] select-none">
          <p className="uppercase text-yellow-400 text-2xl font-semibold text-shadow-superhot">
            slot machine
          </p>
        </div>

        <SlotMachineCanvas
          reelStates={reelStates}
          positions={positions}
          showLine={showLine}
          windowWidth={windowWidth}
          isMobile={isMobile}
          slotHeight={slotHeight}
          totalHeight={totalHeight}
          winningMatrix={winningMatrix}
          hasHandledWin={hasWon}
          tempWinning={tempWinning}
        />

        {isMobile && (
          <div className="mb-[10%] flex flex-col gap-2">
            <p className="uppercase text-xs text-slate-300">
              please, place your bet
            </p>
            <div className={`flex flex-row gap-2 md:gap-4`}>
              {fixedBetAmounts.map((x) => (
                <div
                  key={x}
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
      </div>
      <SlotMachineFooter
        isMobile={isMobile}
        balance={balance}
        lastWin={lastWin}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        startSpinning={startSpinning}
        spinningColumns={spinningReels}
        fixedBetAmounts={fixedBetAmounts}
        isButtonDisabled={isButtonDisabled}
        handleBetAmountChange={handleBetAmountChange}
        openDoubleWinAmountModal={() =>
          openModal(ModalTypes.DoubleWinAmountModal)
        }
        hasWon={hasWon}
        openOptionsModal={() => openModal(ModalTypes.OptionsModal)}
        closeOptionsModal={() => closeModal(ModalTypes.OptionsModal)}
        isOptionsModalOpen={isModalOpen.optionsModal}
        payoutsHandler={payoutsHandler}
        tempWinning={tempWinning}
        isAutoSpinEnabled={isAutoSpinEnabled}
        setIsAutoSpinEnabled={setIsAutoSpinEnabled}
        autoSpinIntervalRef={autoSpinIntervalRef}
      />
    </div>
  );
};
