import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Film, User, BookmarkPlus, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8
        ${isScrolled ? 'navbar-solid py-2' : 'navbar-transparent py-4'}
      `}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Film className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">MovieBox</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/movies" className="nav-link">Movies</Link>
            {isAuthenticated && (
              <Link to="/watchlists" className="nav-link">My Watchlists</Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
          </div>
          
          {/* Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 pl-10 pr-3 w-56 bg-dark-400 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <img 
                    src={user?.avatar || "https://i.pravatar.cc/150?u=default"} 
                    alt="User avatar" 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-dark-400 rounded-md shadow-lg overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top-right">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-dark-300">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </div>
                    </Link>
                    <Link to="/watchlists" className="block px-4 py-2 text-sm text-white hover:bg-dark-300">
                      <div className="flex items-center">
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        My Watchlists
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-dark-300"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-500 mt-2 rounded-md p-4 animate-slide-down">
          <form onSubmit={handleSearchSubmit} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-3 bg-dark-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </form>
          
          <div className="flex flex-col space-y-3">
            <Link to="/" className="nav-link py-2">Home</Link>
            <Link to="/movies" className="nav-link py-2">Movies</Link>
            {isAuthenticated && (
              <Link to="/watchlists" className="nav-link py-2">My Watchlists</Link>
            )}
            {user?.isAdmin && (
              <Link to="/admin" className="nav-link py-2">Admin</Link>
            )}
            
            <div className="border-t border-gray-700 pt-3 mt-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/profile" className="flex items-center text-white py-2">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-white py-2"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login">
                    <Button variant="outline" fullWidth>Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button fullWidth>Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;