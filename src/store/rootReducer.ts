import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from '../features/auth/slices/authSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
