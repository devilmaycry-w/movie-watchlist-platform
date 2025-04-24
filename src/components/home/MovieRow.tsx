import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, MovieCategory } from '../../types';
import MovieCard from '../ui/MovieCard';
import { getMoviesByCategory } from '../../services/api';

interface MovieRowProps {
  title: string;
  category: MovieCategory;
  watchlistId?: string;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, category, watchlistId }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const rowRef = useRef<HTMLDivElement>(null);
  
  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getMoviesByCategory(category);
        setMovies(data.results);
      } catch (error) {
        console.error(`Error fetching ${category} movies:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, [category]);
  
  // Check if scroll buttons should be shown
  useEffect(() => {
    const checkScroll = () => {
      if (rowRef.current) {
        setShowLeftScroll(rowRef.current.scrollLeft > 0);
        setShowRightScroll(
          rowRef.current.scrollLeft < 
          rowRef.current.scrollWidth - rowRef.current.clientWidth - 10
        );
      }
    };
    
    const rowElement = rowRef.current;
    if (rowElement) {
      rowElement.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => {
        rowElement.removeEventListener('scroll', checkScroll);
      };
    }
  }, [movies]);
  
  // Scroll handlers
  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: -rowRef.current.clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: rowRef.current.clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div 
              key={index} 
              className="bg-dark-400 rounded-md animate-pulse"
              style={{ height: '240px' }}
            />
          ))}
        </div>
      </div>
    );
  }
  
  // Render no movies state
  if (movies.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
        <div className="flex justify-center items-center h-40 bg-dark-400 rounded-md">
          <p className="text-gray-400">No movies available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">{title}</h2>
      
      <div className="relative group">
        {/* Left scroll button */}
        {showLeftScroll && (
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-500 bg-opacity-70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}
        
        {/* Movie row */}
        <div 
          ref={rowRef}
          className="flex overflow-x-auto hide-scrollbar gap-4 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map(movie => (
            <div 
              key={movie.id} 
              className="flex-none w-[180px] sm:w-[200px] animate-fade-in"
              style={{ animationDelay: `${Math.random() * 0.3}s` }}
            >
              <MovieCard movie={movie} watchlistId={watchlistId} />
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        {showRightScroll && (
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-dark-500 bg-opacity-70 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;