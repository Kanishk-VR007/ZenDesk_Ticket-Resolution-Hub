// src/store/slices/agentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { agentService } from '../../services/agentService';
export const fetchAgentWorkload = createAsyncThunk(
    'agents/fetchWorkload',
    async (_, thunkAPI) => {
        try {
            return await agentService.getAgentWorkload();
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch agent workload');
        }
    }
);
export const toggleAgentStatus = createAsyncThunk(
    'agents/toggleStatus',
    async (agentId, thunkAPI) => {
        try {
            return await agentService.toggleAvailability(agentId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to update agent status');
        }
    }
);

const initialState = {
    agents: [], 
    isLoading: false,
    error: null,
};

const agentSlice = createSlice({
    name: 'agents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentWorkload.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAgentWorkload.fulfilled, (state, action) => {
                state.isLoading = false;
                state.agents = action.payload; // Updates with sorted agent list[cite: 2]
            })
            .addCase(fetchAgentWorkload.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(toggleAgentStatus.fulfilled, (state, action) => {
                const updatedAgent = action.payload;
                const index = state.agents.findIndex(a => a.id === updatedAgent.id);
                if (index !== -1) {
                    state.agents[index] = updatedAgent;
                }
            });
    },
});

export default agentSlice.reducer;