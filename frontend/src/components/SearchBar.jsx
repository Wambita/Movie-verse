import React, { useState, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { searchMovies } from '../services/tmdb';

const SearchBar = ({ onResultsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search movies..."
          className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
      {error && (
        <div className="absolute w-full mt-1 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchBar;