// API configuration for TMDB
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''; // Using environment variable
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image sizes
export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
};

// API endpoints
export const API_ENDPOINTS = {
  trending: '/trending/movie/week',
  popular: '/movie/popular',
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  movieDetails: (id: number) => `/movie/${id}`,
  movieCredits: (id: number) => `/movie/${id}/credits`,
  movieVideos: (id: number) => `/movie/${id}/videos`,
  movieRecommendations: (id: number) => `/movie/${id}/recommendations`,
  search: '/search/movie',
  genres: '/genre/movie/list'
};

// Build image URL
export const getImageUrl = (path: string, size: string = POSTER_SIZES.medium): string => {
  if (!path) return '/placeholder-poster.jpg';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Get formatted release year
export const getYearFromDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
};

// Format runtime to hours and minutes
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};