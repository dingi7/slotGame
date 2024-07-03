import { useState } from "react";

export type ModalState =
  | "win"
  | "insufficientFunds"
  | "doubleWinAmountModal"
  | "optionsModal"
  | "";

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

  const closeModal = (modal: ModalState = "") => {
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
