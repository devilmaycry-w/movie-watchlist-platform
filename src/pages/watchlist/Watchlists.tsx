import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash, Eye, EyeOff, Film, List } from 'lucide-react';
import { useWatchlistStore } from '../../store/watchlistStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Watchlists: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const { user } = useAuthStore();
  const { 
    watchlists, 
    createWatchlist, 
    deleteWatchlist, 
    updateWatchlist 
  } = useWatchlistStore();
  
  // Get user watchlists
  const userWatchlists = user 
    ? watchlists.filter(list => list.userId === user.id)
    : [];
  
  // Handle create watchlist
  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWatchlistName.trim()) return;
    
    createWatchlist(
      newWatchlistName, 
      newWatchlistDescription, 
      isPublic
    );
    
    // Reset form
    setNewWatchlistName('');
    setNewWatchlistDescription('');
    setIsPublic(false);
    setIsCreating(false);
  };
  
  // Handle toggle public status
  const handleTogglePublic = (id: string, currentStatus: boolean) => {
    updateWatchlist(id, { isPublic: !currentStatus });
  };
  
  // Handle delete watchlist
  const handleDeleteWatchlist = (id: string) => {
    if (confirm('Are you sure you want to delete this watchlist?')) {
      deleteWatchlist(id);
    }
  };
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Watchlists</h1>
          
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
              icon={<Plus className="w-5 h-5" />}
            >
              Create Watchlist
            </Button>
          )}
        </div>
        
        {/* Create Watchlist Form */}
        {isCreating && (
          <div className="bg-dark-400 rounded-lg p-6 mb-8 animate-slide-down">
            <h2 className="text-xl font-bold mb-4">Create New Watchlist</h2>
            
            <form onSubmit={handleCreateWatchlist}>
              <Input
                label="Watchlist Name"
                value={newWatchlistName}
                onChange={(e) => setNewWatchlistName(e.target.value)}
                placeholder="e.g., My Favorite Movies"
                required
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newWatchlistDescription}
                  onChange={(e) => setNewWatchlistDescription(e.target.value)}
                  placeholder="What's this watchlist about?"
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="is-public"
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    className="h-4 w-4 bg-dark-300 border-gray-600 rounded focus:ring-primary"
                  />
                  <label htmlFor="is-public" className="ml-2 text-sm text-gray-300">
                    Make this watchlist public
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit">
                  Create Watchlist
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
        
        {/* Watchlists Grid */}
        {userWatchlists.length === 0 ? (
          <div className="bg-dark-400 rounded-lg p-12 text-center">
            <Film className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">No watchlists yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first watchlist to start tracking movies you want to watch
            </p>
            {!isCreating && (
              <Button 
                onClick={() => setIsCreating(true)}
                icon={<Plus className="w-5 h-5" />}
              >
                Create Watchlist
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userWatchlists.map(watchlist => (
              <div 
                key={watchlist.id} 
                className="bg-dark-400 rounded-lg overflow-hidden shadow-lg transition-transform hover:transform hover:scale-102"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{watchlist.name}</h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      watchlist.isPublic 
                        ? 'bg-success-900 text-success-400' 
                        : 'bg-secondary-900 text-secondary-400'
                    }`}>
                      {watchlist.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {watchlist.description || 'No description'}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <Film className="w-4 h-4 mr-1" />
                    <span>{watchlist.movies.length} movies</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {watchlist.movies.slice(0, 3).map(movie => (
                      <Link to={`/movie/${movie.id}`} key={movie.id}>
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-auto rounded-md hover:opacity-80 transition-opacity"
                        />
                      </Link>
                    ))}
                    {watchlist.movies.length === 0 && (
                      <div className="col-span-3 bg-dark-300 rounded-md h-24 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No movies added yet</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/watchlist/${watchlist.id}`}>
                      <Button 
                        size="sm" 
                        icon={<List className="w-4 h-4" />}
                      >
                        View
                      </Button>
                    </Link>
                    
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      icon={watchlist.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      onClick={() => handleTogglePublic(watchlist.id, watchlist.isPublic)}
                    >
                      {watchlist.isPublic ? 'Make Private' : 'Make Public'}
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-error hover:bg-error-900 hover:text-error"
                      icon={<Trash className="w-4 h-4" />}
                      onClick={() => handleDeleteWatchlist(watchlist.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlists;