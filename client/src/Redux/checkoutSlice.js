import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    subtotal:0,
    shipping:0,
    tax:0,
    total:0
}

const checkoutSlice= createSlice({
    name: "checkout",
    initialState,
    reducers:{
        setOrderSummary:(state, action)=>{
            state.subtotal= action.payload.subtotal;
            state.shipping=action.payload.shipping;
            state.tax=action.payload.tax;
            state.total=action.payload.total;
        }

    }
})

export const { setOrderSummary}= checkoutSlice.actions;

export default checkoutSlice.reducer