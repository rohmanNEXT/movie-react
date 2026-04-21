import type { AuthState, User, Action } from './types';

// Helper to handle local persistence for auth
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('chill_user_session');
  return saved ? JSON.parse(saved) : null;
};

const saveUserToLocal = (user: User | null) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('chill_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('chill_user_session');
    }
  }
};

// 1. Initial State with Persistence
const initialState: AuthState = {
  user: getStoredUser(),
};

// 2. Action Types
const SET_USER = 'auth/setUser';
const LOGOUT = 'auth/logout';

// 3. Reducer
export default function authReducer(state = initialState, action: Action) {
  const { type, payload } = action;

  if (type === SET_USER) {
    const user = payload as User;
    saveUserToLocal(user);
    return { ...state, user };
  } else if (type === LOGOUT) {
    saveUserToLocal(null);
    return { ...state, user: null };
  } else {
    return state;
  }
}

// 4. Action Creators
export const setUser = (user: User) => ({ type: SET_USER, payload: user });
export const logout = () => ({ type: LOGOUT });
