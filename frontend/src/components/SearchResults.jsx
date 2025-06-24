import React from 'react';

const SearchResults = ({ results }) => {
  if (!results.length) return null;

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title}
                className="w-full h-[300px] object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No image available</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                {item.release_date && (
                  <span>{new Date(item.release_date).getFullYear()}</span>
                )}
                {item.vote_average > 0 && (
                  <>
                    <span>•</span>
                    <span>{item.vote_average.toFixed(1)} ⭐</span>
                  </>
                )}
              </div>
              {item.overview && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {item.overview}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;