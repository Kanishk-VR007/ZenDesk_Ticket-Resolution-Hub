import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketService } from '../../services/ticketService';

export const fetchTickets = createAsyncThunk(
    'tickets/fetchTickets',
    async (_, thunkAPI) => {
        try {
            return await ticketService.getTickets();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
        }
    }
);

export const fetchTicketStats = createAsyncThunk(
    'tickets/fetchTicketStats',
    async (_, thunkAPI) => {
        try {
            return await ticketService.getTicketStats();
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch statistics');
        }
    }
);
export const unassignTicket = createAsyncThunk(
    'tickets/unassign',
    async (ticketId, thunkAPI) => {
        try {
            const message = await ticketService.unassignTicket(ticketId); 
            thunkAPI.dispatch(fetchTickets()); 
            return message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to unassign ticket');
        }
    }
);
export const autoAssignTicket = createAsyncThunk(
    'tickets/autoAssign',
    async (ticketId, thunkAPI) => {
        try {
            const message = await ticketService.autoAssignTicket(ticketId);
            thunkAPI.dispatch(fetchTickets()); 
            return message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to assign ticket');
        }
    }
);

const initialState = {
    items: [],       
    stats: null,     
    isLoading: false,
    error: null,
    searchQuery: '',        
    filterStatus: 'All Status',   
}
export const resolveTicket = createAsyncThunk(
    'tickets/resolve',
    async (ticketId, thunkAPI) => {
        try {
    
            const data = await ticketService.updateStatus(ticketId, 'RESOLVED');
            thunkAPI.dispatch(fetchTickets()); 
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        clearTicketError: (state) => {
            state.error = null;
        },
        setSearchQuery: (state, action) => { 
            state.searchQuery = action.payload; 
        },
        setFilterStatus: (state, action) => { 
            state.filterStatus = action.payload; 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTickets.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchTicketStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })
            .addCase('tickets/create/fulfilled', (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export const { clearTicketError, setSearchQuery, setFilterStatus } = ticketSlice.actions;
export default ticketSlice.reducer;