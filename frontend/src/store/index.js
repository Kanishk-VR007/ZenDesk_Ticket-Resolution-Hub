import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticketSlice';
import agentReducer from './slices/agentSlice';
import escalationReducer from './slices/escalationSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tickets: ticketReducer,
        agents: agentReducer,
        escalations: escalationReducer,
        comments: commentReducer,
    },
});