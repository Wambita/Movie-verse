import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useWatchlist from '../hooks/useWatchlist';
import WatchlistButton from '../components/WatchlistButton';
import placeholderImage from '../assets/placeholder.svg';

const WatchlistPage = () => {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [filter, setFilter] = useState('all'); // 'all', 'movies', 'tv'

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const handleItemClick = (item) => {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    router.push(`/${type}/${item.id}`);
  };

  const filteredWatchlist = watchlist.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'movies') return item.media_type === 'movie';
    if (filter === 'tv') return item.media_type === 'tv';
    return true;
  });

  const handleWatchlistToggle = (item, event) => {
    event.stopPropagation();
    removeFromWatchlist(item.id);
  };

  return (
    <div className="space-y-8 px-4 py-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('movies')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'movies'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-6 py-2 rounded-lg transition-colors ${
              filter === 'tv'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            TV Shows
          </button>
        </div>
      </section>

      {filteredWatchlist.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {filter === 'all'
            ? 'Your watchlist is empty. Start adding some movies and TV shows!'
            : `No ${filter === 'movies' ? 'movies' : 'TV shows'} in your watchlist yet.`}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredWatchlist.map((item) => (
            <div
              key={item.id}
              className="bg-opacity-40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-gray-800">
                  <img
                    src={placeholderImage}
                    alt="Loading..."
                    className="absolute inset-0 w-full h-full object-contain opacity-50"
                  />
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : placeholderImage}
                    alt={item.title || item.name}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                    loading="lazy"
                    onError={handleImageError}
                    onLoad={(e) => e.target.style.opacity = '1'}
                    style={{ opacity: '0' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title || item.name}</h3>
                  <div className="text-sm opacity-75">
                    <span className="capitalize">{item.media_type}</span>
                    <span className="mx-2">•</span>
                    <span>Added {new Date(item.added_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <WatchlistButton
                  isInWatchlist={true}
                  onToggleWatchlist={(e) => handleWatchlistToggle(item, e)}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;