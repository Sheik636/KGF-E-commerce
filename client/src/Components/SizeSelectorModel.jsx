const SizeSelectorModal = ({
  show,
  onClose,
  sizes,
  chooseSize,
  setChooseSize,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="card-dark p-6 w-80 animate-scale-in shadow-[0_0_60px_rgba(229,9,20,0.2)]">
        <h2 className="font-display text-2xl text-white tracking-wide mb-1">
          SELECT SIZE
        </h2>
        <div className="w-10 h-0.5 bg-brand-red mb-6" />

        <div className="flex gap-3 flex-wrap mb-6">
          {sizes?.map((size, index) => (
            <button
              key={index}
              onClick={() => setChooseSize(size)}
              className={`px-4 py-2 rounded-lg border font-medium transition-all duration-300 hover:scale-105 ${
                chooseSize === size
                  ? "bg-brand-red border-brand-red text-white shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                  : "bg-brand-dark border-brand-border text-brand-muted hover:border-brand-red hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-outline flex-1 py-2.5 text-sm"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary flex-1 py-2.5 text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectorModal;
