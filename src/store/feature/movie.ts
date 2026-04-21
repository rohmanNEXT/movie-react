import type { Dispatch } from 'redux';
import type { Movie, MovieState, Action } from './types';

// Re-export Movie for components
export type { Movie, MovieState };

// Initialize myList from localStorage if available
const getInitialMyList = () => {
  if (typeof window !== 'undefined') {
    const list = localStorage.getItem('movie_myList');
    if (list) {
      try { return JSON.parse(list); } catch { /* ignore */ }
    }
  }
  return [];
};

// 1. Initial State
const initialState: MovieState = {
  movies: [],
  myList: getInitialMyList(),
  loading: false,
  error: null
};

// 2. Action Types
const FETCH_START = 'movie/fetch_start';
const FETCH_SUCCESS = 'movie/fetch_success';
const FETCH_ERROR = 'movie/fetch_error';
const ADD_MOVIE = 'movie/add_movie';
const UPDATE_MOVIE = 'movie/update_movie';
const DELETE_MOVIE = 'movie/delete_movie';
const TOGGLE_MY_LIST = 'movie/toggle_my_list';

// 3. Reducer
export default function movieReducer(state = initialState, action: Action): MovieState {
  const { type, payload } = action;

  let newState = state;

  if (type === FETCH_START) {
    newState = { ...state, loading: true, error: null };
  } else if (type === FETCH_SUCCESS) {
    const movies = payload as Movie[];
    newState = { ...state, loading: false, movies };
  } else if (type === FETCH_ERROR) {
    newState = { ...state, loading: false, error: payload as string };
  } else if (type === DELETE_MOVIE) {
    const deleteId = payload as number | string;
    const newList = state.movies.filter((m: Movie) => String(m.id) !== String(deleteId));
    newState = { ...state, movies: newList };
  } else if (type === ADD_MOVIE) {
    const newList = [payload as Movie, ...state.movies];
    newState = { ...state, movies: newList };
  } else if (type === UPDATE_MOVIE) {
    const updatedMovie = payload as Movie;
    const newList = state.movies.map((m: Movie) => String(m.id) === String(updatedMovie.id) ? { ...m, ...updatedMovie } : m);
    newState = { ...state, movies: newList };
  } else if (type === TOGGLE_MY_LIST) {
    const id = payload as number | string;
    const exists = state.myList.includes(id);
    const newList = exists 
      ? state.myList.filter((mid: number | string) => mid != id)
      : [...state.myList, id];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('movie_myList', JSON.stringify(newList));
    }
    
    return { ...state, myList: newList };
  }

  return newState;
}

// 5. CRUD Logic using connectApi
import connectApi from '@/services/api';

export const getData = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_START });
  try {
    // Gunakan /db.json jika di prod tanpa API URL, untuk fetch static file di Vercel
    const isStatic = !import.meta.env.DEV && !import.meta.env.VITE_API_URL;
    const endpoint = isStatic ? '/db.json' : '/data';

    const { data } = await connectApi.get(endpoint);
    
    // Normalisasi: json-server /data return array, static /db.json return { data: [] }
    const result = Array.isArray(data) ? data : (data.data || []);
    
    dispatch({ type: FETCH_SUCCESS, payload: result });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("API Error:", errorMessage);
    dispatch({ type: FETCH_ERROR, payload: errorMessage });
  }
};

export const addMovie = (movieData: Partial<Movie>) => async (dispatch: Dispatch) => {
  try {
    const { data } = await connectApi.post('/data', { ...movieData, id: Date.now().toString() });
    dispatch({ type: ADD_MOVIE, payload: data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Add failed:", errorMessage);
  }
};

export const editMovie = (id: number | string, movieData: Partial<Movie>) => async (dispatch: Dispatch) => {
  try {
    const { data } = await connectApi.put(`/data/${id}`, movieData);
    dispatch({ type: UPDATE_MOVIE, payload: data });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Update failed:", errorMessage);
  }
};

export const deleteMovie = (id: number | string) => async (dispatch: Dispatch) => {
  try {
    await connectApi.delete(`/data/${id}`);
    dispatch({ type: DELETE_MOVIE, payload: id });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Delete failed:", errorMessage);
  }
};

export const toggleMyList = (id: number | string) => ({
  type: TOGGLE_MY_LIST,
  payload: id
});
