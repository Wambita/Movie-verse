import React, { useState, useCallback } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { debounce } from '../../utils/debounce';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search movies and TV shows..."
        className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
      />
    </div>
  );
};

export default SearchBar;