import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serviceUrl } from "../Services/url";
import axios from 'axios';

// Signup API
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${serviceUrl}/auth/register`, userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user || response.data.message));
            }
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Login API
export const login = createAsyncThunk(
    'auth/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${serviceUrl}/auth/login`, userData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user || response.data.message));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
)

// Update Business Profile API
export const updateBusinessProfile = createAsyncThunk(
    'auth/updateBusinessProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await axios.post(
                `${serviceUrl}/auth/updateBusinessProfile`,
                formData,
                config
            );
            // Save the profile data
            localStorage.setItem('userProfile', JSON.stringify(response.data.businessProfile || response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get Business Profile API
export const getBusinessProfile = createAsyncThunk(
    'auth/getBusinessProfile',
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${serviceUrl}/auth/getBusinessProfile`, {
                params: { email },
            });
            // Save retrieved profile to localStorage
            localStorage.setItem('userProfile', JSON.stringify(response.data.businessProfile));
            return response.data.businessProfile;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Add Schedule Delivery API
export const addScheduleDeliveries = createAsyncThunk(
    'scheduleDeliveries/addScheduleDeliveries',
    async (scheduleData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post(`${serviceUrl}/scheduleDeliveries/addSchedule`, scheduleData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Get Schedule Deliveries API
export const getScheduleDeliveries = createAsyncThunk(
    'scheduleDeliveries/getScheduleDeliveries',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': token,
                }
            };
            const response = await axios.get(`${serviceUrl}/scheduleDeliveries/getSchedule`, config);
            return response.data.schedules;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Load user and profile from localStorage
export const loadUserFromStorage = createAsyncThunk(
    'auth/loadUserFromStorage',
    async (_, { rejectWithValue }) => {
        try {
            const userData = localStorage.getItem('user');
            const profileData = localStorage.getItem('userProfile');
            
            return {
                user: userData ? JSON.parse(userData) : null,
                profile: profileData ? JSON.parse(profileData) : null
            };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const userSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        error: null,
        loading: false,
        profile: null,
        schedules: [] // Added schedule deliveries state
    },
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload; // Update user object
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        updateProfile: (state, action) => {
            state.profile = action.payload; // Update profile object
            localStorage.setItem('userProfile', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.profile = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userProfile');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBusinessProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBusinessProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(getBusinessProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addScheduleDeliveries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addScheduleDeliveries.fulfilled, (state, action) => {
                state.loading = false;
                // state.schedules.push(action.payload.schedule); // Append new schedule
            })
            .addCase(addScheduleDeliveries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getScheduleDeliveries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getScheduleDeliveries.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = action.payload;
            })
            .addCase(getScheduleDeliveries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loadUserFromStorage.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.profile = action.payload.profile;
            });
    },
});

// Export the actions
export const { updateUser, updateProfile, logout } = userSlice.actions;

export default userSlice.reducer;