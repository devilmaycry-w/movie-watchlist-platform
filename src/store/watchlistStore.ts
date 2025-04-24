import { create } from 'zustand';
import { Movie, Watchlist } from '../types';

interface WatchlistState {
  watchlists: Watchlist[];
  currentWatchlist: Watchlist | null;
  isLoading: boolean;
  error: string | null;
  createWatchlist: (name: string, description?: string, isPublic?: boolean) => void;
  updateWatchlist: (id: string, data: Partial<Watchlist>) => void;
  deleteWatchlist: (id: string) => void;
  addMovieToWatchlist: (watchlistId: string, movie: Movie) => void;
  removeMovieFromWatchlist: (watchlistId: string, movieId: number) => void;
  getWatchlist: (id: string) => Watchlist | null;
  getUserWatchlists: (userId: string) => Watchlist[];
  getPublicWatchlists: () => Watchlist[];
  setCurrentWatchlist: (id: string | null) => void;
}

// Mock data for demo
const mockWatchlists: Watchlist[] = [
  {
    id: 'w1',
    name: 'Favorites',
    description: 'My all-time favorite movies',
    userId: '1', // demo user
    isPublic: true,
    movies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w2',
    name: 'Watch Later',
    description: 'Movies I want to watch soon',
    userId: '1', // demo user
    isPublic: false,
    movies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w3',
    name: 'Staff Picks',
    description: 'Recommended by our team',
    userId: '2', // admin user
    isPublic: true,
    movies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlists: mockWatchlists,
  currentWatchlist: null,
  isLoading: false,
  error: null,
  
  createWatchlist: (name, description = '', isPublic = false) => {
    const newWatchlist: Watchlist = {
      id: `w${Date.now()}`,
      name,
      description,
      userId: '1', // In a real app, this would be the current user ID
      isPublic,
      movies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    set(state => ({
      watchlists: [...state.watchlists, newWatchlist]
    }));
  },
  
  updateWatchlist: (id, data) => {
    set(state => ({
      watchlists: state.watchlists.map(list => 
        list.id === id ? { 
          ...list, 
          ...data,
          updatedAt: new Date().toISOString() 
        } : list
      ),
      currentWatchlist: state.currentWatchlist?.id === id 
        ? { ...state.currentWatchlist, ...data, updatedAt: new Date().toISOString() } 
        : state.currentWatchlist
    }));
  },
  
  deleteWatchlist: (id) => {
    set(state => ({
      watchlists: state.watchlists.filter(list => list.id !== id),
      currentWatchlist: state.currentWatchlist?.id === id ? null : state.currentWatchlist
    }));
  },
  
  addMovieToWatchlist: (watchlistId, movie) => {
    set(state => ({
      watchlists: state.watchlists.map(list => {
        if (list.id === watchlistId) {
          // Check if movie already exists in watchlist
          if (list.movies.some(m => m.id === movie.id)) {
            return list;
          }
          
          return {
            ...list,
            movies: [...list.movies, movie],
            updatedAt: new Date().toISOString()
          };
        }
        return list;
      }),
      currentWatchlist: state.currentWatchlist?.id === watchlistId
        ? {
            ...state.currentWatchlist,
            movies: state.currentWatchlist.movies.some(m => m.id === movie.id)
              ? state.currentWatchlist.movies
              : [...state.currentWatchlist.movies, movie],
            updatedAt: new Date().toISOString()
          }
        : state.currentWatchlist
    }));
  },
  
  removeMovieFromWatchlist: (watchlistId, movieId) => {
    set(state => ({
      watchlists: state.watchlists.map(list => {
        if (list.id === watchlistId) {
          return {
            ...list,
            movies: list.movies.filter(movie => movie.id !== movieId),
            updatedAt: new Date().toISOString()
          };
        }
        return list;
      }),
      currentWatchlist: state.currentWatchlist?.id === watchlistId
        ? {
            ...state.currentWatchlist,
            movies: state.currentWatchlist.movies.filter(movie => movie.id !== movieId),
            updatedAt: new Date().toISOString()
          }
        : state.currentWatchlist
    }));
  },
  
  getWatchlist: (id) => {
    return get().watchlists.find(list => list.id === id) || null;
  },
  
  getUserWatchlists: (userId) => {
    return get().watchlists.filter(list => list.userId === userId);
  },
  
  getPublicWatchlists: () => {
    return get().watchlists.filter(list => list.isPublic);
  },
  
  setCurrentWatchlist: (id) => {
    if (id === null) {
      set({ currentWatchlist: null });
      return;
    }
    
    const watchlist = get().watchlists.find(list => list.id === id) || null;
    set({ currentWatchlist: watchlist });
  }
}));