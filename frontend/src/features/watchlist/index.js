import React from 'react';
import useWatchlist from '../../hooks/useWatchlist';
import { useTheme } from '../theme/ThemeContext';
import placeholderImage from '../../assets/placeholder.svg';
import { useRouter } from 'next/router';

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { theme } = useTheme();
  const router = useRouter();

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const handleItemClick = (item) => {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    router.push(`/${type}/${item.id}`);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Your Watchlist
        </h1>

        {watchlist.length === 0 ? (
          <p className={`text-center text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Your watchlist is empty. Add some movies or TV shows!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((item) => (
              <div
                key={item.id}
                className={`${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
              >
                <div onClick={() => handleItemClick(item)} className="cursor-pointer">
                  <div className={`relative aspect-[2/3] ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : placeholderImage}
                      alt={item.title || item.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                      {item.title || item.name}
                    </h3>
                    <div className={`flex items-center space-x-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                      {item.vote_average && (
                        <span>• {item.vote_average.toFixed(1)} ⭐</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Remove from Watchlist</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;