import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

export const addBill = createAsyncThunk(
  "bill/addBill",
  async (billData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${serviceUrl}/bill/addBill`, billData, {
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
export const getBills = createAsyncThunk(
  "bill/getBills",
  async (billType, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${serviceUrl}/bill/getBill`, {
        params: { billType },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);
export const getInvoices = createAsyncThunk(
  "bill/getInvoices",
  async (billType, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${serviceUrl}/bill/getInvoices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const getBillWiseProfit = createAsyncThunk(
  "bill/getBillWiseProfit",
  async (party, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (party) {
        params.party = party;
      }

      const response = await axios.get(`${serviceUrl}/bill/billWiseProfit`, {
        headers: { Authorization: `${token}` },
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);






const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: [],
    error: null,
    isLoading: false,
    totalInvoices: 1,
    billWiseProfit: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills.push(action.payload.data);
      })
      .addCase(addBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload.data;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getInvoices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInvoices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalInvoices = action.payload.data;
      })
      .addCase(getInvoices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getBillWiseProfit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBillWiseProfit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billWiseProfit = action.payload.data;
      })
      .addCase(getBillWiseProfit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },
});

export default billSlice.reducer;
