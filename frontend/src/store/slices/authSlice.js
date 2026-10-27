import { createSlice } from '@reduxjs/toolkit';

const userString = localStorage.getItem('user');
let parsedUser = null;
try { if (userString) parsedUser = JSON.parse(userString); } catch (e) {}

const initialState = {
    user: parsedUser || null,
    isAuthenticated: !!parsedUser?.token,
    role: parsedUser?.role || null,
    fullName: parsedUser?.fullName || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.fullName = action.payload.fullName;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
            state.fullName = null;
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder) => {
        builder.addCase('auth/login/fulfilled', (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.role = action.payload.role;
            state.fullName = action.payload.fullName;
            localStorage.setItem('user', JSON.stringify(action.payload));
        });
        builder.addCase('auth/logout', (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
            state.fullName = null;
            localStorage.removeItem('user');
        });
    }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;