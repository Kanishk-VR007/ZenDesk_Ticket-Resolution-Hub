// src/store/slices/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentService } from '../../services/commentService';
export const fetchTicketComments = createAsyncThunk(
    'comments/fetchComments',
    async (ticketId, thunkAPI) => {
        try {
            return await commentService.getComments(ticketId);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch comments');
        }
    }
);
export const postComment = createAsyncThunk(
    'comments/postComment',
    async ({ ticketId, commentData }, thunkAPI) => {
        try {
            return await commentService.addComment(ticketId, commentData);
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to post comment');
        }
    }
);

const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments: (state) => {
            state.items = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTicketComments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTicketComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload; 
            })
            .addCase(fetchTicketComments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(postComment.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;