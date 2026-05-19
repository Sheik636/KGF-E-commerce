const SizeSelectorModal = ({show,onClose,sizes,chooseSize,setChooseSize,onConfirm
}) => {

  if(!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-xl font-bold mb-4">
          Select Size
        </h2>

        <div className="flex gap-3 flex-wrap mb-6">
          {sizes?.map(
            (size,index)=>(
              <button key={index} onClick={()=>
                  setChooseSize(size)
                }
                className={`px-4 py-2 border rounded-lg ${chooseSize===size? "bg-black text-white" : "bg-white"}`}>
                {size}
              </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg w-full">
            Cancel
          </button>
          <button
            onClick={onConfirm} className="bg-black text-white px-4 py-2 rounded-lg w-full">
            Add
          </button>
        </div>
      </div>
    </div>

  )

}

export default SizeSelectorModal;