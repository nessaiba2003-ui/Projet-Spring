import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Les futurs reducers (auth, projets, etc.) viendront ici
  },
});
