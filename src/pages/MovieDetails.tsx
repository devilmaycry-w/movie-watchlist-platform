import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Clock, Info, Share2 } from 'lucide-react';
import { getMovieDetails } from '../services/api';
import { getImageUrl, getYearFromDate, formatRuntime } from '../config/api';
import { Movie } from '../types';
import Button from '../components/ui/Button';
import MovieRow from '../components/home/MovieRow';
import { useWatchlistStore } from '../store/watchlistStore';
import { useAuthStore } from '../store/authStore';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { watchlists, addMovieToWatchlist } = useWatchlistStore();
  const { isAuthenticated } = useAuthStore();
  
  // Get default watchlist ID
  const defaultWatchlist = watchlists.find(list => list.userId === '1');
  const defaultWatchlistId = defaultWatchlist?.id;
  
  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getMovieDetails(parseInt(id));
        setMovie(data);
        
        // Check if movie is in watchlist
        const isInAnyWatchlist = watchlists.some(list => 
          list.movies.some(m => m.id === data.id)
        );
        setIsInWatchlist(isInAnyWatchlist);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id, watchlists]);
  
  // Add to watchlist handler
  const handleAddToWatchlist = () => {
    if (movie && defaultWatchlistId) {
      addMovieToWatchlist(defaultWatchlistId, movie);
      setIsInWatchlist(true);
    }
  };
  
  // Loading state
  if (isLoading || !movie) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Backdrop Header */}
      <div className="relative w-full h-[70vh] min-h-[500px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end px-4 sm:px-6 lg:px-8 pb-12 pt-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Poster */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={getImageUrl(movie.poster_path, 'w342')}
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              
              {/* Details */}
              <div className="md:w-2/3 lg:w-3/4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {movie.genres?.map(genre => (
                    <span key={genre.id} className="bg-dark-400 bg-opacity-60 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      {genre.name}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
                  {movie.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6 text-sm">
                  <span>{getYearFromDate(movie.release_date)}</span>
                  {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-8 max-w-3xl">
                  {movie.overview}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Play className="w-5 h-5" />}
                  >
                    Watch Trailer
                  </Button>
                  
                  {isAuthenticated ? (
                    <Button
                      onClick={handleAddToWatchlist}
                      variant={isInWatchlist ? 'secondary' : 'outline'}
                      size="lg"
                      icon={isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      disabled={isInWatchlist}
                    >
                      {isInWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
                    </Button>
                  ) : (
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        icon={<Plus className="w-5 h-5" />}
                      >
                        Login to Add
                      </Button>
                    </Link>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    icon={<Share2 className="w-5 h-5" />}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar Movies */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <MovieRow 
          title="Recommended Movies" 
          category="popular" 
          watchlistId={defaultWatchlistId}
        />
      </div>
    </div>
  );
};

export default MovieDetails;