import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    setUserName(username);
    setIsAuthenticated(!!token);
    
    // Attempt to retrieve user data if token exists
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data", error);
        }
      }
    }
  }, []);

  const login = (token, username, userData = {}) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUserName(username);
    setIsAuthenticated(true);
    
    if (userData && Object.keys(userData).length > 0) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    setUserName('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);