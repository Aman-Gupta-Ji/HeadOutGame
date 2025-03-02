import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import UserAvatar from './useAvatar';

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="flex items-center">
              <Logo />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Globetrotter
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to={isAuthenticated ? "/play" : '/signin'}>Play</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserDropdown logout={logout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="px-2 pt-2 space-y-1">
              <MobileNavLink to="/play">Play</MobileNavLink>
              <MobileNavLink to="/leaderboard">Leaderboard</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <MobileNavLink to="/signin">Sign In</MobileNavLink>
                  <MobileNavLink to="/signup">Sign Up</MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-headout-purple font-bold' : 'text-gray-500 hover:text-headout-purple'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive ? 'text-headout-purple bg-headout-bg font-bold' : 'text-gray-500 hover:text-headout-purple hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

const UserDropdown = ({ logout }) => (
  <div className="relative group">
    <button className="flex items-center space-x-2">
      <UserAvatar />
      <span className="text-gray-500 hover:text-gray-700">▼</span>
    </button>
    
    <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-headout-bg hover:text-headout-purple"
      >
        Profile
      </Link>
      <button
        onClick={logout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-headout-bg hover:text-headout-purple"
      >
        Logout
      </button>
    </div>
  </div>
);

const AuthButtons = () => (
  <>
    <NavLink to="/signin">Sign In</NavLink>
    <Link
      to="/signup"
      className="bg-headout-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-headout-dark transition-colors"
    >
      Sign Up
    </Link>
  </>
);