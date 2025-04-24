import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Star } from 'lucide-react';
import { Movie } from '../../types';
import { getImageUrl, getYearFromDate } from '../../config/api';
import { useWatchlistStore } from '../../store/watchlistStore';

interface MovieCardProps {
  movie: Movie;
  watchlistId?: string;
  showAddButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  watchlistId,
  showAddButton = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);
  const { addMovieToWatchlist, watchlists } = useWatchlistStore();
  
  // Check if movie is in any watchlist
  const isInAnyWatchlist = watchlists.some(list => 
    list.movies.some(m => m.id === movie.id)
  );
  
  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (watchlistId) {
      addMovieToWatchlist(watchlistId, movie);
      setIsAddedAnimation(true);
      setTimeout(() => setIsAddedAnimation(false), 1500);
    }
  };
  
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="movie-card block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-auto rounded-md transition-transform duration-300"
        loading="lazy"
      />
      
      <div className={`movie-card-overlay ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-md font-bold mb-1 line-clamp-1">{movie.title}</h3>
        
        <div className="flex items-center text-sm mb-2">
          <span className="flex items-center mr-2">
            <Star className="w-4 h-4 text-warning-500 mr-1" />
            {movie.vote_average.toFixed(1)}
          </span>
          <span>{getYearFromDate(movie.release_date)}</span>
        </div>
        
        <p className="text-xs text-gray-300 line-clamp-2">{movie.overview}</p>
        
        {showAddButton && (
          <button
            onClick={handleAddToWatchlist}
            disabled={isInAnyWatchlist || !watchlistId}
            className={`
              mt-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${isInAnyWatchlist 
                ? 'bg-success text-white cursor-default' 
                : 'bg-primary hover:bg-primary-600 text-white'}
              ${isAddedAnimation ? 'scale-110' : 'scale-100'}
            `}
          >
            <span className="flex items-center justify-center">
              {isInAnyWatchlist ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Watchlist
                </>
              )}
            </span>
          </button>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;