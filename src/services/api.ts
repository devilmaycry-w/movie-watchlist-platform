import { TMDB_API_KEY, TMDB_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Movie, MovieCategory } from '../types';

// Helper function to make API requests
const fetchFromTMDB = async (endpoint: string, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  
  // Add API key and other params
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
};

// Get movies by category
export const getMoviesByCategory = async (
  category: MovieCategory, 
  page = 1
): Promise<{ results: Movie[], total_pages: number }> => {
  let endpoint;
  
  switch (category) {
    case 'trending':
      endpoint = API_ENDPOINTS.trending;
      break;
    case 'popular':
      endpoint = API_ENDPOINTS.popular;
      break;
    case 'topRated':
      endpoint = API_ENDPOINTS.topRated;
      break;
    case 'upcoming':
      endpoint = API_ENDPOINTS.upcoming;
      break;
    default:
      endpoint = API_ENDPOINTS.popular;
  }
  
  return fetchFromTMDB(endpoint, { page });
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<Movie> => {
  return fetchFromTMDB(API_ENDPOINTS.movieDetails(movieId), {
    append_to_response: 'videos,credits,recommendations'
  });
};

// Search movies
export const searchMovies = async (
  query: string, 
  page = 1
): Promise<{ results: Movie[], total_pages: number }> => {
  return fetchFromTMDB(API_ENDPOINTS.search, { query, page });
};

// Get movie genres
export const getGenres = async () => {
  return fetchFromTMDB(API_ENDPOINTS.genres);
};