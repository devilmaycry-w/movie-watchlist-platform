import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Film, List, BarChart, Activity, 
  ArrowUpRight, TrendingUp, User, Calendar
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWatchlistStore } from '../../store/watchlistStore';
import { Movie } from '../../types';
import { getMoviesByCategory } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { watchlists } = useWatchlistStore();
  const navigate = useNavigate();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  
  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !user?.isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Fetch trending movies for analytics
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const data = await getMoviesByCategory('trending');
        setTrendingMovies(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching trending movies:', error);
      }
    };
    
    fetchTrendingMovies();
  }, []);
  
  // Mock stats (in a real app, these would come from the backend)
  const stats = {
    totalUsers: 1354,
    newUsers: 58,
    activeUsers: 732,
    totalWatchlists: watchlists.length,
    publicWatchlists: watchlists.filter(list => list.isPublic).length,
    averageMoviesPerWatchlist: Math.round(
      watchlists.reduce((acc, list) => acc + list.movies.length, 0) / 
      Math.max(watchlists.length, 1)
    ),
    topGenres: ['Action', 'Drama', 'Science Fiction', 'Adventure', 'Comedy']
  };
  
  // Mock user activity data
  const userActivity = [
    { day: 'Mon', value: 120 },
    { day: 'Tue', value: 140 },
    { day: 'Wed', value: 180 },
    { day: 'Thu', value: 220 },
    { day: 'Fri', value: 250 },
    { day: 'Sat', value: 280 },
    { day: 'Sun', value: 230 }
  ];
  
  // Check if loading or not admin
  if (!isAuthenticated || !user || !user.isAdmin) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">Access Denied</h3>
          <p className="text-gray-400 mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-400 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm uppercase">Users</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalUsers}</h3>
                <p className="text-success-500 flex items-center text-sm mt-2">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{stats.newUsers} this month
                </p>
              </div>
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-dark-400 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm uppercase">Watchlists</p>
                <h3 className="text-3xl font-bold mt-1">{stats.totalWatchlists}</h3>
                <p className="text-success-500 flex items-center text-sm mt-2">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  {stats.publicWatchlists} public
                </p>
              </div>
              <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                <List className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-dark-400 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm uppercase">Avg Movies/List</p>
                <h3 className="text-3xl font-bold mt-1">{stats.averageMoviesPerWatchlist}</h3>
                <p className="text-gray-400 flex items-center text-sm mt-2">
                  Per watchlist average
                </p>
              </div>
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <Film className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-dark-400 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm uppercase">Active Users</p>
                <h3 className="text-3xl font-bold mt-1">{stats.activeUsers}</h3>
                <p className="text-primary flex items-center text-sm mt-2">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {Math.round(stats.activeUsers / stats.totalUsers * 100)}% of total
                </p>
              </div>
              <div className="bg-primary bg-opacity-20 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Activity Chart */}
          <div className="lg:col-span-2 bg-dark-400 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">User Activity</h3>
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">Last 7 days</span>
                <BarChart className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between">
              {userActivity.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-10 bg-primary rounded-t-sm transition-all hover:opacity-80"
                    style={{ height: `${item.value / 3}px` }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top Movies */}
          <div className="bg-dark-400 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Top Trending Movies</h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-4">
              {trendingMovies.map((movie, index) => (
                <div key={movie.id} className="flex items-start">
                  <div className="mr-4 w-6 h-6 flex items-center justify-center rounded-full bg-dark-300 text-gray-300 text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white truncate">{movie.title}</h4>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(movie.release_date).getFullYear()}
                      </span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-dark-400 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            
            <div className="space-y-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4">
                    <div className="w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center overflow-hidden">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">
                      <span className="font-medium">User {Math.floor(Math.random() * 900) + 100}</span>
                      {' '}
                      {['added a movie to', 'created', 'shared', 'updated'][Math.floor(Math.random() * 4)]}
                      {' '}
                      <span className="text-primary">watchlist</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {Math.floor(Math.random() * 59) + 1} {['minutes', 'hours', 'days'][Math.floor(Math.random() * 3)]} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-6 w-full py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-dark-300 transition-colors">
              View All Activity
            </button>
          </div>
          
          {/* Popular Genres */}
          <div className="bg-dark-400 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Popular Genres</h3>
            
            <div className="space-y-4">
              {stats.topGenres.map((genre, index) => (
                <div key={index} className="bg-dark-300 rounded-lg overflow-hidden">
                  <div className="h-2 bg-primary" style={{ width: `${100 - index * 15}%` }}></div>
                  <div className="p-3 flex justify-between items-center">
                    <span>{genre}</span>
                    <span className="text-gray-400">{100 - index * 15}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;