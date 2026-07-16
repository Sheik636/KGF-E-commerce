import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";
import wishlistReducer from "./wishlistSlice"

export const store= configureStore({
    reducer:{
        cart: cartReducer,
        checkout: checkoutReducer,
        wishlist: wishlistReducer
    }
})