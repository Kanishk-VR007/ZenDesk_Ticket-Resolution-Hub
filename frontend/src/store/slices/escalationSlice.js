// src/store/slices/escalationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { escalationService } from '../../services/escalationService';

export const fetchUnresolvedEscalations = createAsyncThunk(
    'escalations/fetchUnresolved',
    async (_, thunkAPI) => {
        try {
            return await escalationService.getUnresolvedEscalations();
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch escalations');
        }
    }
);

export const resolveTicketEscalation = createAsyncThunk(
    'escalations/resolve',
    async (escalationId, thunkAPI) => {
        try {
            return await escalationService.resolveEscalation(escalationId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to resolve escalation');
        }
    }
);

const initialState = {
    items: [], 
    isLoading: false,
    error: null,
};

const escalationSlice = createSlice({
    name: 'escalations',
    initialState,
    reducers: {
        clearEscalationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnresolvedEscalations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUnresolvedEscalations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchUnresolvedEscalations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(resolveTicketEscalation.fulfilled, (state, action) => {
                const resolvedId = action.payload.id;
                state.items = state.items.filter(esc => esc.id !== resolvedId);
            });
    },
});

export const { clearEscalationError } = escalationSlice.actions;
export default escalationSlice.reducer;