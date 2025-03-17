import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from 'axios';

// Add Party with Token in Headers
export const addCategory = createAsyncThunk(
    'item/addCategory',
    async (partyData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serviceUrl}/item/addCategory`, partyData, {
                headers: {
                    Authorization: token, // Add token to headers
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Get Parties with Token in Headers
export const getCategory = createAsyncThunk(
    'item/getCategory',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serviceUrl}/item/getCategory`, {
                headers: {
                    Authorization: token, // Add token to headers
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const addItem = createAsyncThunk(
    'item/addItem',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serviceUrl}/item/addItem`, data, {
                headers: {
                    Authorization: token, // Add token to headers
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const editItem = createAsyncThunk(
    'item/editItem',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${serviceUrl}/item/editItem`, data, {
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
export const deleteItem = createAsyncThunk(
    'item/deleteItem',
    async (itemCode, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${serviceUrl}/item/deleteItem`, {
                data: { itemCode },  // For DELETE requests, data goes in the 'data' property
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

export const updateItems = createAsyncThunk(
    'item/updateItems',
    async (data, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${serviceUrl}/item/updateItems`, data, {
                headers: {
                    Authorization: token, // Add token to headers
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const getItems = createAsyncThunk(
    'item/getItems',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serviceUrl}/item/getItems`, {
                headers: {
                    Authorization: token, // Add token to headers
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);
export const addPrimaryUnit = createAsyncThunk(
    'item/addPrimaryUnit',
    async ({ name, email }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serviceUrl}/item/addPrimaryUnit`,
                { name, email },  // Send email in request body
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

export const addSecondaryUnit = createAsyncThunk(
    'item/addSecondaryUnit',
    async ({ name, email }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${serviceUrl}/item/addSecondaryUnit`,
                { name, email }, // Send email in request body
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

// Fetch Primary Units by Email
export const getAllPrimaryUnits = createAsyncThunk(
    'item/getAllPrimaryUnits',
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serviceUrl}/item/getAllPrimaryUnits`, {
                params: { email },  // Send email as query param
                headers: {
                    Authorization: token,
                },
            });
            return response.data.primaryUnit;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Fetch Secondary Units by Email
export const getAllSecondaryUnits = createAsyncThunk(
    'item/getAllSecondaryUnits',
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${serviceUrl}/item/getAllSecondaryUnits`, {
                params: { email },  // Send email as query param
                headers: {
                    Authorization: token,
                },
            });
            return response.data.secondaryUnit;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const addConversion = createAsyncThunk(
    "conversion/addConversion",
    async ({ email, primaryUnit, secondaryUnit, conversionRate }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${serviceUrl}/item/addConversions`,
                { email, primaryUnit, secondaryUnit, conversionRate },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// GET: Fetch Conversions by Email
export const getConversions = createAsyncThunk(
    "conversion/getConversions",
    async (email, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${serviceUrl}/item/getConversions`, {
                params: { email },
                headers: {
                    Authorization: token,
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyItemName = createAsyncThunk(
    'item/verifyItemName',
    async (itemName, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${serviceUrl}/item/verifyItemName`,
                { itemName },
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

const itemSlice = createSlice({
    name: 'item',
    initialState: {
        categories: [],
        items: [],
        conversions: [],
        primaryUnits: [],
        secondaryUnits: [],
        error: null,
        isUnique: true,
        isLoading: false,
        enabledFields: {
            enableItem: false,
            sellType: '',
            barcode: false,
            mrp: false,
            serialNo: false,
            batchNo: false,
            expDate: false,
            mfgDate: false,
            modelNo: false,
            size: false,
            stock: false,
            description: false,
            mrpEnabled: false,
            mrpValue: '',
            serialNoEnabled: false,
            serialNoValue: '',
            batchNoEnabled: false,
            batchNoValue: '',
            expDateEnabled: false,
            expDateFormat: '',
            expDateValue: '',
            mfgDateEnabled: false,
            mfgDateFormat: '',
            mfgDateValue: '',
            modelNoEnabled: false,
            modelNoValue: '',
            sizeEnabled: false,
            sizeValue: ''
        },
        customFields: []
    },
    reducers: {
        toggleField: (state, action) => {
            state.enabledFields[action.payload] = !state.enabledFields[action.payload];
        },
        updateCustomFields: (state, action) => {
            state.customFields = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.categories.push(action.payload.data);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload.data; // Update with fetched parties
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addItem.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.categories = action.payload.data; // Update with fetched parties
            })
            .addCase(addItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getItems.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.data; // Update with fetched parties
            })
            .addCase(getItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(addPrimaryUnit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addPrimaryUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.categories = action.payload.data; // Update with fetched parties
            })
            .addCase(addPrimaryUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getAllPrimaryUnits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllPrimaryUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.primaryUnits = action.payload;
            })
            .addCase(getAllPrimaryUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(addSecondaryUnit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addSecondaryUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.categories = action.payload.data; // Update with fetched parties
            })
            .addCase(addSecondaryUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getAllSecondaryUnits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllSecondaryUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.secondaryUnits = action.payload;
            })
            .addCase(getAllSecondaryUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addConversion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addConversion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversions.push(action.payload);
            })
            .addCase(addConversion.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(getConversions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getConversions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversions = action.payload;
            })
            .addCase(getConversions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(editItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(editItem.fulfilled, (state, action) => {
                state.isLoading = false;
                const editedItem = action.payload.data;
                const index = state.items.findIndex(item => item.itemCode === editedItem.itemCode);
                if (index !== -1) {
                    state.items[index] = editedItem;
                }
            })
            .addCase(editItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteItem.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.isLoading = false;
                // Remove the deleted item from the items array
                state.items = state.items.filter(
                    item => item.itemCode !== action.payload.data.itemCode
                );
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(verifyItemName.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyItemName.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isUnique = action.payload.isUnique
            })
            .addCase(verifyItemName.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});
export const { toggleField, updateCustomFields } = itemSlice.actions;
export default itemSlice.reducer;
