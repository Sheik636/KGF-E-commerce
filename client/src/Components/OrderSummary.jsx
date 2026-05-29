import { useDispatch } from "react-redux";
import { setOrderSummary } from "../Redux/checkoutSlice"

const OrderSummary = ({cartItems, buttonText= "Proceed to Checkout", buttonAction}) => {

    const dispatch= useDispatch()
    const subtotal= cartItems.reduce((acc,item)=> acc+ item.price*item.quantity,0);
      const shipping= subtotal>1000 ? 0:99;
      const tax= Math.round(subtotal*0.05);
      const total= subtotal+shipping+tax;

      const handleButtonClick= async()=>{
        dispatch(setOrderSummary({
            subtotal,
            shipping,
            tax,
            total
        }))
        await buttonAction()
      }
  return (
    <div className="mt-8 border rounded-xl p-6 shadow-md bg-red-200 max-w-6xl ml-auto">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div  className="flex justify-between mb-3"><span>Subtotal</span> <span>₹{subtotal}</span> </div>
        <div className="flex justify-between mb-3"><span>Shipping</span> <span>₹{shipping}</span> </div>
        <div className="flex justify-between mb-3"><span>Tax</span> <span>₹{tax}</span> </div>
        <hr className="my-4"/>
        <div className="flex justify-between mb-3"><span>Total</span> <span>₹{total}</span> </div>
        <button onClick={handleButtonClick} disabled={cartItems.length===0} className="bg-blue-500 rounded-lg text-white px-4 py-2 mt-3">{buttonText}</button>
    </div>
  )
}

export default OrderSummary