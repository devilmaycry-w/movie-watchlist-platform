import React from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../types';
import { Loader } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  emptyMessage?: string;
  watchlistId?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  isLoading = false, 
  emptyMessage = 'No movies found',
  watchlistId
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map(movie => (
        <div key={movie.id} className="animate-fade-in">
          <MovieCard movie={movie} watchlistId={watchlistId} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;