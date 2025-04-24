import React, { useState, useEffect } from 'react';
import { getMoviesByCategory } from '../services/api';
import HeroSection from '../components/home/HeroSection';
import MovieRow from '../components/home/MovieRow';
import { Movie } from '../types';
import { useWatchlistStore } from '../store/watchlistStore';

const Home: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { createWatchlist, watchlists } = useWatchlistStore();
  
  // Get default watchlist ID
  const defaultWatchlist = watchlists.find(list => list.userId === '1');
  const defaultWatchlistId = defaultWatchlist?.id;
  
  // Fetch featured movie (random from trending)
  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        setIsLoading(true);
        const data = await getMoviesByCategory('trending');
        
        if (data.results && data.results.length > 0) {
          // Select a random movie from the top 5
          const topMovies = data.results.slice(0, 5);
          const randomIndex = Math.floor(Math.random() * topMovies.length);
          setFeaturedMovie(topMovies[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedMovie();
  }, []);
  
  // Create a default watchlist if none exists
  useEffect(() => {
    if (watchlists.filter(list => list.userId === '1').length === 0) {
      createWatchlist('My Watchlist', 'Your personal collection of movies to watch later', true);
    }
  }, [watchlists, createWatchlist]);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {!isLoading && featuredMovie && (
        <HeroSection movie={featuredMovie} />
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 -mt-16 relative z-10">
        {/* Movie Rows */}
        <MovieRow 
          title="Trending Now" 
          category="trending" 
          watchlistId={defaultWatchlistId}
        />
        
        <MovieRow 
          title="Popular Movies" 
          category="popular" 
          watchlistId={defaultWatchlistId}
        />
        
        <MovieRow 
          title="Top Rated" 
          category="topRated" 
          watchlistId={defaultWatchlistId}
        />
        
        <MovieRow 
          title="Upcoming" 
          category="upcoming" 
          watchlistId={defaultWatchlistId}
        />
      </div>
    </div>
  );
};

export default Home;