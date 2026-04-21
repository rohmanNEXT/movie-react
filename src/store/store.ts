import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import type { UnknownAction, Middleware } from 'redux';
import { thunk } from 'redux-thunk';
import type { ThunkDispatch } from 'redux-thunk';
import movieReducer from './feature/movie';
import authReducer from './feature/auth';
import type { MovieState, AuthState } from './feature/types';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

export interface ApplicationState {
  movies: MovieState;
  auth: AuthState;
}

const rootReducer = combineReducers({
  movies: movieReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk as unknown as Middleware));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
