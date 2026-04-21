export type Movie = {
  id: number | string;
  title: string;
  image: string;
  rating: number;
  year: number;
  category: string;
  isNewEpisode: boolean;
  trailerId: string;
  description: string;
  fullDescription?: string;
  imdbLink?: string;
  tomatoLink?: string;
};

export interface MovieState {
  movies: Movie[];
  myList: (number | string)[];
  loading: boolean;
  error: string | null;
}

export type User = {
  id?: number;
  username: string;
  email?: string;
  avatar?: string;
  role?: 'admin' | 'user';
};

export interface AuthState {
  user: User | null;
}

export interface Action<P = unknown> {
  type: string;
  payload?: P;
}
