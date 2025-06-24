import React, { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { searchMovies } from '../services/tmdb';
import { useTheme } from '../features/theme/ThemeContext';

const SearchBar = ({ onResultsChange = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        onResultsChange([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchMovies(query);
        onResultsChange(data.results || []);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results');
        onResultsChange([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [onResultsChange]
  );

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search movies and TV shows..."
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors duration-200 ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500' 
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-400 focus:border-purple-400'}`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent text-purple-500"></div>
          </div>
        )}
      </div>
      {error && (
        <div className={`absolute w-full mt-1 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;