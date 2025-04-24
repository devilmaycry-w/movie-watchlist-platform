import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, BookmarkPlus } from 'lucide-react';
import { Movie } from '../../types';
import { getImageUrl, getYearFromDate, formatRuntime } from '../../config/api';
import { useWatchlistStore } from '../../store/watchlistStore';
import Button from '../ui/Button';

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const { addMovieToWatchlist, getUserWatchlists } = useWatchlistStore();
  const userWatchlists = getUserWatchlists('1'); // In a real app, this would use the current user ID
  
  const handleAddToWatchlist = () => {
    if (userWatchlists.length > 0) {
      addMovieToWatchlist(userWatchlists[0].id, movie);
    }
  };
  
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };
  
  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[800px]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isImageLoaded ? 'opacity-60' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="container mx-auto">
          <div className="max-w-2xl animate-slide-up">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded">
                Featured
              </span>
              {movie.genres?.slice(0, 2).map(genre => (
                <span key={genre.id} className="bg-dark-400 bg-opacity-60 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                  {genre.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {movie.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6 text-sm">
              <span>{getYearFromDate(movie.release_date)}</span>
              {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
              <span className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            
            <p className="text-gray-300 text-base md:text-lg mb-8 line-clamp-3">
              {movie.overview}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleViewDetails}
                icon={<Info className="w-5 h-5" />}
                size="lg"
              >
                More Info
              </Button>
              
              <Button 
                onClick={handleAddToWatchlist}
                variant="outline"
                icon={<BookmarkPlus className="w-5 h-5" />}
                size="lg"
              >
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;