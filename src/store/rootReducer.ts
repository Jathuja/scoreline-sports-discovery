import { combineReducers } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from '../features/auth/slices/authSlice';
import discoveryReducer from '../features/discovery/slices/discoverySlice';
import favouritesReducer from '../features/favourites/slices/favouritesSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  discovery: discoveryReducer,
  favourites: favouritesReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
