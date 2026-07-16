import { createSlice } from "@reduxjs/toolkit";

const storedWishlist =
    localStorage.getItem("wishlistItems");

const initialState = {
    wishlistItems: storedWishlist
        ? JSON.parse(storedWishlist)
        : [],
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,

    reducers: {
        addToWishlist: (state, action) => {
            const exists =
                state.wishlistItems.find(
                    item =>
                        item._id === action.payload._id
                );

            if (!exists) {
                state.wishlistItems.push(
                    action.payload
                );

                localStorage.setItem(
                    "wishlistItems",
                    JSON.stringify(
                        state.wishlistItems
                    )
                );
            }
        },

        removeFromWishlist: (
            state,
            action
        ) => {
            state.wishlistItems =
                state.wishlistItems.filter(
                    item =>
                        item._id !== action.payload
                );

            localStorage.setItem(
                "wishlistItems",
                JSON.stringify(
                    state.wishlistItems
                )
            );
        },

        clearWishlist: (state) => {
            state.wishlistItems = [];

            localStorage.removeItem(
                "wishlistItems"
            );
        },
    },
});

export const {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;