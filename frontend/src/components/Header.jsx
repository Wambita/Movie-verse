import React from 'react';
import { useTheme } from '../features/theme/ThemeContext';
import Link from 'next/link';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              MovieVerse
            </h1>
            <nav className="hidden md:flex space-x-4">
              <Link href="/" className="hover:text-purple-500 transition-colors">Home</Link>
              <Link href="/search" className="hover:text-purple-500 transition-colors">Search</Link>
              <Link href="/watchlist" className="hover:text-purple-500 transition-colors">Watchlist</Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;