import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';
export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || 'שגיאה בטעינה');
    }
});

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTickets: (state) => {
            state.list = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTickets } = ticketSlice.actions;
export default ticketSlice.reducer;