import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice' // Adjust path to your auth slice

export const store = configureStore({
  reducer: {
    auth: authSlice,
    // Add other reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch