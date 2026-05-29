import  { createSlice } from "@reduxjs/toolkit";
import { jsxs } from "react/jsx-runtime";


const initialState ={
    cartItems : localStorage.getItem("cartItems")? JSON.parse(localStorage.getItem("cartItems")):[]
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            const existItem = state.cartItems.find((item)=>item._id === action.payload._id && item.chooseSize === action.payload.chooseSize);
            if(existItem){
                existItem.quantity += 1
            }else{
                state.cartItems.push(
                    action.payload
                )
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        removeFromCart:(state,action)=>{
            state.cartItems= state.cartItems.filter((_,index)=>index !== action.payload)
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        clearCart:(state)=>{
            state.cartItems=[];
            localStorage.removeItem("cartItems")
        },
        increaseQuantity:(state,action)=>{
            const item = state.cartItems.find((_,index)=>index===action.payload);
            if(item){
                item.quantity += 1;
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        },
        decreaseQuantity:(state,action)=>{
            const item = state.cartItems.find((_,index)=>index===action.payload);
            if(item && item.quantity > 1){
                item.quantity -= 1;
            }
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems))
        }
    }
})

export const {addToCart, removeFromCart,clearCart, increaseQuantity, decreaseQuantity}= cartSlice.actions;

export default cartSlice.reducer