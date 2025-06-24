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
    return item.media_type === filter;
  }).sort((a, b) => new Date(b.added_at) - new Date(a.added_at));

  const handleWatchlistToggle = (item, event) => {
    event.stopPropagation();
    removeFromWatchlist(item.id);
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'movie', label: 'Movies' },
    { id: 'tv', label: 'TV Shows' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Watchlist
        </h1>
        <div className="flex justify-center gap-4 mb-8">
          {filters.map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-6 py-2 rounded-full transition-colors ${
                filter === filterOption.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </section>

      {filteredWatchlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {filter === 'all'
              ? 'Your watchlist is empty. Start adding some movies and TV shows!'
              : `No ${filter === 'movie' ? 'movies' : 'TV shows'} in your watchlist yet.`}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredWatchlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
                  <img
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : placeholderImage}
                    alt={item.title || item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">{item.title || item.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="capitalize">{item.media_type}</span>
                    <span>•</span>
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