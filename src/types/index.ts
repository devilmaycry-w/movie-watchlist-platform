export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: Genre[];
  runtime?: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
}

export type MovieCategory = 'trending' | 'popular' | 'topRated' | 'upcoming';