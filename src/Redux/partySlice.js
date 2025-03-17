import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from 'axios';

export const addParty = createAsyncThunk(
    'party/addParty',
    async (partyData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serviceUrl}/party/addParty`, partyData, {
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

export const getParties = createAsyncThunk(
    'party/getParties',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serviceUrl}/party/getParties`, {
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

export const editParty = createAsyncThunk(
    'party/editParty',
    async (partyData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${serviceUrl}/party/editParty`, partyData, {
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

export const deleteParty = createAsyncThunk(
    'party/deleteParty',
    async (partyId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${serviceUrl}/party/deleteParty`, {
                data: { partyId },
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

export const partyStatement = createAsyncThunk(
    'party/partyStatement',
    async ({ selectedParty, isProfitLoss }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${serviceUrl}/party/partyStatement`,
          {
            params: { 
              party: selectedParty, 
              isProfitLoss: isProfitLoss,
            },
            headers: {
              Authorization: token, 
            },
          }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response);
      }
    }
);

export const verifyPartyName = createAsyncThunk(
    'party/verifyPartyName',
    async (partyName, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${serviceUrl}/party/verifyPartyName`,
                { partyName },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

const partySlice = createSlice({
    name: 'party',
    initialState: {
        parties: [],
        error: null,
        partyBills: [],
        partyPayments: [],
        isLoading: false,
        isPartyNameUnique: true
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addParty.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addParty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.parties.push(action.payload.data);
            })
            .addCase(addParty.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getParties.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getParties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.parties = action.payload.data; 
            })
            .addCase(getParties.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(editParty.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editParty.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.parties.findIndex(party => party.partyId === action.payload.data.partyId);
                if (index !== -1) {
                    state.parties[index] = action.payload.data;
                }
            })
            .addCase(editParty.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteParty.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteParty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.parties = state.parties.filter(
                    party => party.partyId !== action.payload.data.partyId
                );
            })
            .addCase(deleteParty.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(partyStatement.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(partyStatement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.partyBills = action.payload.Bills;
                state.partyPayments = action.payload.Payments;
            })
            .addCase(partyStatement.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(verifyPartyName.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyPartyName.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isPartyNameUnique = action.payload.isUnique
            })
            .addCase(verifyPartyName.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default partySlice.reducer;