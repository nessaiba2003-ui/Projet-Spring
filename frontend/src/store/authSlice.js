import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      const payload = action.payload || {};
      const incomingRole = payload.role || payload.user?.role || null;
      state.token = payload.token || null;
      state.role = incomingRole;
      state.user = payload.user || {
        username: payload.username || null,
        role: incomingRole,
      };
      state.isAuthenticated = Boolean(state.token);
      if (state.token) localStorage.setItem('token', state.token);
      if (state.role) localStorage.setItem('role', state.role);
    },
    syncProfileSuccess: (state, action) => {
      const payload = action.payload || {};
      const resolvedRole = payload.role || payload.user?.role || state.role || null;
      state.role = resolvedRole;
      state.user = {
        ...(state.user || {}),
        ...(payload.user || {}),
        username: payload.username || payload.user?.username || state.user?.username || null,
        role: resolvedRole,
      };
      state.isAuthenticated = Boolean(state.token);
      if (state.role) localStorage.setItem('role', state.role);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { loginSuccess, syncProfileSuccess, logout } = authSlice.actions;
export default authSlice.reducer;