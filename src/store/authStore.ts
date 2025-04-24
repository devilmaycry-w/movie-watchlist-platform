import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Simulated users database for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    avatar: 'https://i.pravatar.cc/150?u=demo',
    isAdmin: false
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    isAdmin: true
  }
];

// Mock authentication functions for demo
const mockAuth = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },
  
  register: async (username: string, email: string, password: string): Promise<User> => {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      email,
      avatar: `https://i.pravatar.cc/150?u=${username}`,
      isAdmin: false
    };
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    return newUser;
  },
  
  logout: (): void => {
    localStorage.removeItem('user');
  },
  
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Create auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email, password) => {
    try {
      set({ isLoading: true });
      const user = await mockAuth.login(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (username, email, password) => {
    try {
      set({ isLoading: true });
      const user = await mockAuth.register(username, email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    mockAuth.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuthStatus: async () => {
    set({ isLoading: true });
    const user = mockAuth.getUser();
    set({ 
      user, 
      isAuthenticated: !!user,
      isLoading: false 
    });
  }
}));