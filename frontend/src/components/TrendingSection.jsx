import React from 'react';
import { useTheme } from '../features/theme/ThemeContext';

const TrendingSection = ({ onFilterChange, activeFilter }) => {
  const { theme } = useTheme();
  const filters = [
    { id: 'all', label: 'All Trending' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-center gap-4 flex-wrap">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-6 py-2 rounded-full transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;