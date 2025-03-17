import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from "axios";

// Add General Settings
export const addGeneralSettings = createAsyncThunk(
    "settings/addGeneralSettings",
    async (settingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${serviceUrl}/settings/addGeneralsettings`, settingsData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const getGeneralSettings = createAsyncThunk(
    "settings/getGeneralSettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const params = {};
            if (email) {
                params.email = email;
            }

            const response = await axios.get(`${serviceUrl}/settings/getGeneralSettings`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.generalSettings;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Add Transaction Settings
export const addTransactionSettings = createAsyncThunk(
    "settings/addTransactionSettings",
    async (settingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serviceUrl}/settings/addTransactionSettings`,
                settingsData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Get Transaction Settings
export const getTransactionSettings = createAsyncThunk(
    "settings/getTransactionSettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/settings/getTransactionSettings`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Add Party Settings
export const addPartySettings = createAsyncThunk(
    "settings/addPartySettings",
    async (partySettingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serviceUrl}/settings/addPartySettings`,
                partySettingsData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Get Party Settings
export const getPartySettings = createAsyncThunk(
    "settings/getPartySettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/settings/getPartySettings`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.partySettings;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const addTransactionMessageSettings = createAsyncThunk(
    "settings/addTransactionMessageSettings",
    async (settingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serviceUrl}/settings/addTransactionMessageSettings`,
                settingsData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Get Transaction Message Settings
export const getTransactionMessageSettings = createAsyncThunk(
    "settings/getTransactionMessageSettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/settings/getTransactionMessageSettings`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.transactionMessageSettings;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
export const addPrintSettings = createAsyncThunk(
    "settings/addPrintSettings",
    async (settingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serviceUrl}/settings/addPrintSettings`,
                settingsData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Get Transaction Message Settings
export const getPrintSettings = createAsyncThunk(
    "settings/getPrintSettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/settings/getPrintSettings`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

// Get Thermal Print Settings
export const getThermalPrintSettings = createAsyncThunk(
    "settings/getThermalPrintSettings",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/settings/getThermalPrintSettings`, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.data; // Adjust according to API response
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        allGeneralSettings: {},
        allTransactionSettings: null,
        allPartySettings: null, // Adding partySettings to the state
        allTransactionMessageSettings: null,
        allPrintSettings: null,
        allThermalPrintSettings: null,
        error: null,
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addGeneralSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addGeneralSettings.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(addGeneralSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getGeneralSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getGeneralSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allGeneralSettings = action.payload;
            })
            .addCase(getGeneralSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addTransactionSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addTransactionSettings.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addTransactionSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getTransactionSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTransactionSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTransactionSettings = action.payload;
            })
            .addCase(getTransactionSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addPartySettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPartySettings.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addPartySettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getPartySettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPartySettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPartySettings = action.payload;
            })
            .addCase(getPartySettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            .addCase(addTransactionMessageSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addTransactionMessageSettings.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addTransactionMessageSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Handling Transaction Message Settings (Get)
            .addCase(getTransactionMessageSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTransactionMessageSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTransactionMessageSettings = action.payload;
            })
            .addCase(getTransactionMessageSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(addPrintSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPrintSettings.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(addPrintSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Handling Transaction Message Settings (Get)
            .addCase(getPrintSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getPrintSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allPrintSettings = action.payload;
            })
            .addCase(getPrintSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getThermalPrintSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getThermalPrintSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allThermalPrintSettings = action.payload;
            })
            .addCase(getThermalPrintSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export default settingsSlice.reducer;
