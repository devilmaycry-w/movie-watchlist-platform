import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Film, Share2, Edit, Trash, User, Calendar, Lock, Unlock 
} from 'lucide-react';
import { useWatchlistStore } from '../../store/watchlistStore';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/ui/Button';
import MovieGrid from '../../components/ui/MovieGrid';

const WatchlistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    getWatchlist, 
    setCurrentWatchlist, 
    currentWatchlist, 
    updateWatchlist,
    deleteWatchlist
  } = useWatchlistStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPublic, setEditIsPublic] = useState(false);
  
  // Load watchlist
  useEffect(() => {
    if (id) {
      setCurrentWatchlist(id);
    }
    
    return () => {
      setCurrentWatchlist(null);
    };
  }, [id, setCurrentWatchlist]);
  
  // Initialize edit form
  useEffect(() => {
    if (currentWatchlist) {
      setEditName(currentWatchlist.name);
      setEditDescription(currentWatchlist.description || '');
      setEditIsPublic(currentWatchlist.isPublic);
    }
  }, [currentWatchlist]);
  
  // Handle toggle editing
  const handleToggleEditing = () => {
    setIsEditing(!isEditing);
  };
  
  // Handle save changes
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWatchlist || !editName.trim()) return;
    
    updateWatchlist(currentWatchlist.id, {
      name: editName,
      description: editDescription,
      isPublic: editIsPublic
    });
    
    setIsEditing(false);
  };
  
  // Handle delete watchlist
  const handleDeleteWatchlist = () => {
    if (!currentWatchlist) return;
    
    if (confirm('Are you sure you want to delete this watchlist?')) {
      deleteWatchlist(currentWatchlist.id);
      navigate('/watchlists');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if loading or not found
  if (!currentWatchlist) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Film className="h-16 w-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">Watchlist not found</h3>
          <p className="text-gray-400 mb-6">
            The watchlist you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/watchlists')}>
            Back to Watchlists
          </Button>
        </div>
      </div>
    );
  }
  
  // Check ownership
  const isOwner = user?.id === currentWatchlist.userId;
  
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {isEditing ? (
          // Edit Form
          <div className="bg-dark-400 rounded-lg p-6 mb-8 animate-scale">
            <h2 className="text-xl font-bold mb-4">Edit Watchlist</h2>
            
            <form onSubmit={handleSaveChanges}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Watchlist Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="is-public-edit"
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={() => setEditIsPublic(!editIsPublic)}
                    className="h-4 w-4 bg-dark-300 border-gray-600 rounded focus:ring-primary"
                  />
                  <label htmlFor="is-public-edit" className="ml-2 text-sm text-gray-300">
                    Make this watchlist public
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button type="submit">
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          // Watchlist Header
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold mr-2">{currentWatchlist.name}</h1>
                  {currentWatchlist.isPublic ? (
                    <span className="bg-success-900 text-success-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Public
                    </span>
                  ) : (
                    <span className="bg-secondary-900 text-secondary-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-2">
                  {currentWatchlist.description || 'No description'}
                </p>
                <div className="flex flex-wrap text-sm text-gray-500">
                  <div className="flex items-center mr-6 mb-2">
                    <User className="w-4 h-4 mr-1" />
                    <span>Created by {isOwner ? 'you' : 'another user'}</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Created {formatDate(currentWatchlist.createdAt)}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Film className="w-4 h-4 mr-1" />
                    <span>{currentWatchlist.movies.length} movies</span>
                  </div>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex space-x-2 mt-4 md:mt-0">
                  <Button 
                    onClick={handleToggleEditing}
                    icon={<Edit className="w-5 h-5" />}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="secondary"
                    icon={currentWatchlist.isPublic ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    onClick={() => updateWatchlist(currentWatchlist.id, { isPublic: !currentWatchlist.isPublic })}
                  >
                    {currentWatchlist.isPublic ? 'Make Private' : 'Make Public'}
                  </Button>
                  <Button 
                    variant="ghost"
                    icon={<Share2 className="w-5 h-5" />}
                  >
                    Share
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-error hover:bg-error-900 hover:text-error"
                    icon={<Trash className="w-5 h-5" />}
                    onClick={handleDeleteWatchlist}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Movies Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Movies</h2>
          
          <MovieGrid 
            movies={currentWatchlist.movies}
            emptyMessage={
              isOwner 
                ? "You haven't added any movies to this watchlist yet" 
                : "This watchlist doesn't have any movies yet"
            }
            watchlistId={currentWatchlist.id}
          />
        </div>
      </div>
    </div>
  );
};

export default WatchlistDetail;