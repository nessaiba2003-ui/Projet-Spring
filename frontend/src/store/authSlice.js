import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // On récupère le rôle stocké par le Login
    role: localStorage.getItem('role') || null,
    user: null
  },
  reducers: {
    setCredentials: (state, action) => {
      state.role = action.payload.role;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.role = null;
      state.user = null;
      localStorage.clear();
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;