import { useState } from "react";

export enum ModalTypes {
  Win = "win",
  InsufficientFunds = "insufficientFunds",
  DoubleWinAmountModal = "doubleWinAmountModal",
  OptionsModal = "optionsModal",
  All = "",
}

export type ModalState =
  | ModalTypes.Win
  | ModalTypes.InsufficientFunds
  | ModalTypes.DoubleWinAmountModal
  | ModalTypes.OptionsModal
  | ModalTypes.All;

const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState({
    win: false,
    insufficientFunds: false,
    doubleWinAmountModal: false,
    optionsModal: false,
  });

  const openModal = (modal: ModalState) => {
    setIsModalOpen((prevState) => ({
      ...prevState,
      [modal]: true,
    }));
  };

  const closeModal = (modal: ModalState = ModalTypes.All) => {
    if (!modal) {
      // Close all modals
      setIsModalOpen({
        win: false,
        insufficientFunds: false,
        doubleWinAmountModal: false,
        optionsModal: false,
      });
      return;
    }

    setIsModalOpen((prevState) => ({
      ...prevState,
      [modal]: false,
    }));
  };

  return { isModalOpen, openModal, closeModal };
};

export default useModal;
