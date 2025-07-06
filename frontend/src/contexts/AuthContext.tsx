import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TUserResponse, TUserLogin } from '../lib/types';
import { loginUser } from '../components/apis/userApi';
import { useToast } from './ToastContext';

interface AuthContextType {
  isLoggedIn: boolean;
  user: TUserResponse | null;
  login: (credentials: TUserLogin, rememberMe: boolean) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<TUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Check for existing token/user on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (token && userStr) {
        try {
          setUser(JSON.parse(userStr));
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (credentials: TUserLogin, rememberMe: boolean) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      
      // Store in appropriate storage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', response.access_token);
      storage.setItem('user', JSON.stringify(response.user));
      
      setIsLoggedIn(true);
      setUser(response.user);
      showToast(`@${response.user.username} logged in successfully`, 'success');
      return response;
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please check your credentials.', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 