import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

export const addPaymentIn = createAsyncThunk(
    "payment/addPaymentIn",
    async (billData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/payment/addPaymentIn`, billData, {
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
export const getPaymentIn = createAsyncThunk(
    "payment/getPaymentIn",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/payment/getPaymentIn`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
export const addPaymentOut = createAsyncThunk(
    "payment/addPaymentOut",
    async (billData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/payment/addPaymentOut`, billData, {
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
export const getPaymentOut = createAsyncThunk(
    "payment/getPaymentOut",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/payment/getPaymentOut`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const getAllPayments = createAsyncThunk(
    "payment/getAllPayments",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/payment/getAllPayments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentIn: [],
        paymentOut: [],
        allPayments: [],
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPaymentIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPaymentIn.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addPaymentIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getPaymentIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPaymentIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentIn = action.payload.payments;
            })
            .addCase(getPaymentIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addPaymentOut.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPaymentOut.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addPaymentOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getPaymentOut.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPaymentOut.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentOut = action.payload.payments;
            })
            .addCase(getPaymentOut.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getAllPayments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPayments = action.payload.payments;
            })
            .addCase(getAllPayments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default paymentSlice.reducer;
