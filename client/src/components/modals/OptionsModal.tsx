type Props = {
  closeModal: () => void;
  isOpen: boolean;
  handleBetAmountChange: (number: number) => void;
};

const OptionsModal = ({ closeModal, isOpen, handleBetAmountChange }: Props) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-800 p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Bet Options</h2>
            <div className="flex justify-center space-x-4">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={() => handleBetAmountChange(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OptionsModal;
