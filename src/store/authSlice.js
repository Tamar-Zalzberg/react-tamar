import { createSlice } from '@reduxjs/toolkit';
const savedUser = JSON.parse(localStorage.getItem('user'));
const savedToken = localStorage.getItem('token');
const initialState = {
    user: savedUser || null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    loading: false,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;