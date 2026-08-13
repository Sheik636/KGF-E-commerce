import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../Services/api";

const storedWishlist = localStorage.getItem("wishlistItems");

const initialState = {
  wishlistItems: storedWishlist ? JSON.parse(storedWishlist) : [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/users/wishlist");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const syncAddToWishlist = createAsyncThunk(
  "wishlist/syncAddToWishlist",
  async (product, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await API.post("/users/wishlist/add", {
          productId: product._id,
        });
        return response.data;
      }
      const state = getState();
      const current = state.wishlist.wishlistItems;
      if (!current.some((item) => item._id === product._id)) {
        return [...current, product];
      }
      return current;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const syncRemoveFromWishlist = createAsyncThunk(
  "wishlist/syncRemoveFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await API.delete(`/users/wishlist/remove/${productId}`);
        return response.data;
      }
      const state = getState();
      return state.wishlist.wishlistItems.filter((item) => item._id !== productId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.wishlistItems = action.payload;
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },

    addToWishlist: (state, action) => {
      const exists = state.wishlistItems.find(
        (item) => item._id === action.payload._id
      );

      if (!exists) {
        state.wishlistItems.push(action.payload);
        localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
      }
    },

    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlistItems));
    },

    clearWishlist: (state) => {
      state.wishlistItems = [];
      localStorage.removeItem("wishlistItems");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        localStorage.setItem("wishlistItems", JSON.stringify(action.payload));
      })
      .addCase(syncAddToWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        localStorage.setItem("wishlistItems", JSON.stringify(action.payload));
      })
      .addCase(syncRemoveFromWishlist.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        localStorage.setItem("wishlistItems", JSON.stringify(action.payload));
      });
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;