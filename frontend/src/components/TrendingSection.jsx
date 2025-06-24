import React from 'react';

const TrendingSection = ({ onFilterChange, activeFilter }) => {
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
            className={`px-6 py-2 rounded-full transition-colors ${
              activeFilter === filter.id
                ? 'bg-purple-600 text-white'
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