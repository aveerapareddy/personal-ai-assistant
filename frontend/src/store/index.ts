import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    analysis: analysisReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 