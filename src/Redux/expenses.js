import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

// Add Expense Category
export const addExpenseCategory = createAsyncThunk(
    "expense/addExpenseCategory",
    async (expenseData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/expense/addExpenseCategory`, expenseData, {
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

// Get Expense Categories
export const getExpenseCategory = createAsyncThunk(
    "expense/getExpenseCategory",
    async (billType, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/expense/getExpenseCategory`, {
                params: { billType },
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Add Expense Item
export const addExpenseItem = createAsyncThunk(
    "expense/addExpenseItem",
    async (itemData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/expense/addExpenseItem`, itemData, {
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

// Get Expense Items
export const getExpenseItems = createAsyncThunk(
    "expense/getExpenseItems",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/expense/getExpenseItems`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Add Expense
export const addExpenses = createAsyncThunk(
    "expense/addExpenses",
    async (expenseData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/expense/addExpenses`, expenseData, {
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

// Get Expenses
export const getExpenses = createAsyncThunk(
    "expense/getExpenses",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/expense/getExpenses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


// Expenses Slice
const expensesSlice = createSlice({
    name: "expense",
    initialState: {
        expenses: [],          // For expense categories
        expenseItems: [],      // For expense items
        allExpenses: [],      // For expense items
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Expense Category
            .addCase(addExpenseCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addExpenseCategory.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addExpenseCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Expense Categories
            .addCase(getExpenseCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getExpenseCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenses = action.payload.data;
            })
            .addCase(getExpenseCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Add Expense Item
            .addCase(addExpenseItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addExpenseItem.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addExpenseItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Expense Items
            .addCase(getExpenseItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getExpenseItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenseItems = action.payload.expenseItems; // Assign fetched expense items
            })
            .addCase(getExpenseItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add Expense
            .addCase(addExpenses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Get Expenses
            .addCase(getExpenses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allExpenses = action.payload.data; // Store fetched expenses
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default expensesSlice.reducer;
