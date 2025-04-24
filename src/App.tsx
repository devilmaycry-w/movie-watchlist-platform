import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Watchlists from './pages/watchlist/Watchlists';
import WatchlistDetail from './pages/watchlist/WatchlistDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import Search from './pages/Search';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  isAdmin = false 
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin && !user?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { checkAuthStatus } = useAuthStore();
  
  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            
            {/* Protected Routes */}
            <Route 
              path="/watchlists" 
              element={
                <ProtectedRoute>
                  <Watchlists />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watchlist/:id" 
              element={
                <ProtectedRoute>
                  <WatchlistDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;