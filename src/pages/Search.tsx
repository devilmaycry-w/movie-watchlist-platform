import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { searchMovies } from '../services/api';
import { Movie } from '../types';
import MovieGrid from '../components/ui/MovieGrid';
import Button from '../components/ui/Button';
import { useWatchlistStore } from '../store/watchlistStore';

const Search: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const { watchlists } = useWatchlistStore();
  const defaultWatchlist = watchlists.find(list => list.userId === '1');
  const defaultWatchlistId = defaultWatchlist?.id;
  
  // Search handler
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await searchMovies(searchQuery, page);
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalResults(data.total_results);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Search on query param change
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      handleSearch();
    }
  }, [initialQuery]);
  
  // Handle search submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  // Handle load more
  const handleLoadMore = () => {
    handleSearch(currentPage + 1);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setMovies([]);
    setTotalResults(0);
  };
  
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Movies</h1>
          
          <form onSubmit={handleSubmit} className="relative mb-6">
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for movies..."
                  className="w-full pl-12 pr-12 py-3 bg-dark-400 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <Button type="submit" className="rounded-l-none">
                Search
              </Button>
              
              <Button 
                type="button" 
                variant="secondary" 
                className="ml-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
            
            {showFilters && (
              <div className="mt-4 p-4 bg-dark-400 rounded-md animate-slide-down">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Genre
                    </label>
                    <select className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">All Genres</option>
                      <option value="28">Action</option>
                      <option value="12">Adventure</option>
                      <option value="16">Animation</option>
                      <option value="35">Comedy</option>
                      <option value="80">Crime</option>
                      <option value="99">Documentary</option>
                      <option value="18">Drama</option>
                      <option value="10751">Family</option>
                      <option value="14">Fantasy</option>
                      <option value="36">History</option>
                      <option value="27">Horror</option>
                      <option value="10402">Music</option>
                      <option value="9648">Mystery</option>
                      <option value="10749">Romance</option>
                      <option value="878">Science Fiction</option>
                      <option value="10770">TV Movie</option>
                      <option value="53">Thriller</option>
                      <option value="10752">War</option>
                      <option value="37">Western</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Year
                    </label>
                    <select className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">All Years</option>
                      {[...Array(30)].map((_, i) => (
                        <option key={i} value={2025 - i}>
                          {2025 - i}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Sort By
                    </label>
                    <select className="w-full px-3 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="popularity.desc">Popularity</option>
                      <option value="vote_average.desc">Rating</option>
                      <option value="release_date.desc">Release Date (Newest)</option>
                      <option value="release_date.asc">Release Date (Oldest)</option>
                      <option value="original_title.asc">Title (A-Z)</option>
                      <option value="original_title.desc">Title (Z-A)</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="mr-2"
                  >
                    Reset
                  </Button>
                  <Button type="button" size="sm">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {totalResults > 0 
                  ? `Found ${totalResults} results for "${searchQuery}"` 
                  : `No results for "${searchQuery}"`
                }
              </h2>
            </div>
          </div>
        )}
        
        <MovieGrid 
          movies={movies}
          isLoading={isLoading}
          emptyMessage={
            searchQuery 
              ? `No movies found matching "${searchQuery}"` 
              : "Search for movies to see results"
          }
          watchlistId={defaultWatchlistId}
        />
        
        {movies.length > 0 && currentPage < totalPages && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleLoadMore}
              variant="secondary"
              loading={isLoading}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;