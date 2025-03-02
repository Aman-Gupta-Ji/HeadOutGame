import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        // If token exists, try to get user data
        if (token) {
          try {
            const response = await axios.get(ENDPOINTS.USER, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.data) {
              setUser(response.data);
              setUserName(username || response.data.username);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(response.data));
            }
          } catch (error) {
            // Token might be invalid/expired, clear storage
            console.error("Auth verification failed:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
          }
        } else {
          // No token found
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth context error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = (token, username, userData = {}) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUserName(username);
    setIsAuthenticated(true);
    
    if (userData && Object.keys(userData).length > 0) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    toast.success(`Welcome back, ${username}!`);
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Notify the server about logout (optional)
        await axios.post(ENDPOINTS.LOGOUT, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all auth data regardless of server response
      setUserName('');
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      toast.info("You've been logged out");
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await axios.put(ENDPOINTS.USER, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setUser({ ...user, ...response.data });
        localStorage.setItem('user', JSON.stringify({ ...user, ...response.data }));
        if (userData.username) {
          setUserName(userData.username);
          localStorage.setItem('username', userData.username);
        }
        toast.success("Profile updated successfully");
        return true;
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userName, 
      user, 
      isLoading,
      login, 
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);