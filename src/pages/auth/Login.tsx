import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setError(null);
      await login(email, password);
      navigate('/'); // Redirect to home after successful login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };
  
  const handleDemoLogin = async () => {
    try {
      setError(null);
      await login('demo@example.com', 'password');
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-dark-400 rounded-lg shadow-xl overflow-hidden animate-scale">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Sign in to access your watchlists and more
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-error-900 border border-error rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 text-error mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              required
            />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-dark-300 border-gray-600 rounded focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
            >
              Sign In
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-400 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleDemoLogin}
            >
              Demo Account
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;