import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

export const addJournalEntry = createAsyncThunk(
    "journalentry/addJournalEntry",
    async (billData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/journalEntry/addJournalEntry`, billData, {
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
export const getJournalEntry = createAsyncThunk(
    "journalentry/getJournalEntry",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${serviceUrl}/journalEntry/getJournalEntry`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  );

const journalEntrySlice = createSlice({
    name: "journalentry",
    initialState: {
        journalentries: [],
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addJournalEntry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addJournalEntry.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addJournalEntry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getJournalEntry.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getJournalEntry.fulfilled, (state, action) => {
                state.isLoading = false;
                state.journalentries = action.payload.data;
            })
            .addCase(getJournalEntry.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default journalEntrySlice.reducer;
