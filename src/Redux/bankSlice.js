import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

export const addBank = createAsyncThunk(
    "bank/addBank",
    async (billData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/bank/addBank`, billData, {
                headers: {
                    Authorization: token,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const getAllBank = createAsyncThunk(
    "bank/getAllBank",
    async (billType, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${serviceUrl}/bank/getAllBank`, {
          params: { billType }, 
          headers: { Authorization: `Bearer ${token}` }, 
        });
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );

const bankSlice = createSlice({
    name: "bank",
    initialState: {
        banks: [],
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addBank.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addBank.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addBank.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getAllBank.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllBank.fulfilled, (state, action) => {
                state.isLoading = false;
                state.banks = action.payload.data;
            })
            .addCase(getAllBank.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default bankSlice.reducer;
