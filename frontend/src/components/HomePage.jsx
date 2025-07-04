import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending } from '../services/tmdb';
import { getEnhancedMovieDetails } from '../services/enhanced';
import { discoverMoviesByGenre, discoverTVByGenre } from '../services/genres';
import { throttle } from '../utils/debounce';
import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import WatchlistButton from './WatchlistButton';
import TrendingSection from './TrendingSection';
import placeholderImage from '../assets/placeholder.svg';
import { useRouter } from 'next/router';
import useWatchlist from '../hooks/useWatchlist';
import { useTheme } from '../features/theme/ThemeContext'; 
const HomePage = () => {
  const router = useRouter();
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { theme } = useTheme();
  const [content, setContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [contentFilter, setContentFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const loadingRef = useRef(false);

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
    setIsSearching(results.length > 0);
  }, []);

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const handleItemClick = (item) => {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    router.push(`/${type}/${item.id}`);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
    setContent([]);
  };

  const handleFilterChange = (filter) => {
    setContentFilter(filter);
    setSelectedGenre(null);
    setPage(1);
    setContent([]);
  };

  const fetchContent = async (pageNum) => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      let data;
      if (selectedGenre) {
        data = await (contentFilter === 'tv'
          ? discoverTVByGenre(selectedGenre.id, pageNum)
          : discoverMoviesByGenre(selectedGenre.id, pageNum));
      } else {
        data = await getTrending(pageNum);
      }

      const filteredResults = contentFilter === 'all'
        ? data.results
        : data.results.filter(item => {
            const itemType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
            return itemType === contentFilter;
          });

      const enhancedData = await Promise.allSettled(
        filteredResults.map(async (item) => {
          if (item.media_type === 'movie' || (!item.media_type && !item.first_air_date)) {
            try {
              const enhanced = await getEnhancedMovieDetails(item.id);
              return { ...item, ...enhanced };
            } catch (error) {
              console.warn(`Failed to get enhanced details for movie ${item.id}:`, error);
              return item;
            }
          }
          return item;
        })
      );

      const processedData = enhancedData
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      setContent(prev => pageNum === 1 ? processedData : [...prev, ...processedData]);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to fetch content. Please try again later.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleScroll = useCallback(
    throttle(() => {
      if (searchResults.length > 0) return;
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        if (!loading && hasMore) {
          setPage(prev => prev + 1);
        }
      }
    }, 500),
    [loading, hasMore, searchResults.length]
  );

  useEffect(() => {
    if (searchResults.length === 0) {
      fetchContent(page);
    }
  }, [page, searchResults.length, selectedGenre, contentFilter]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleWatchlistToggle = (item, event) => {
    event.stopPropagation();
    const isInList = isInWatchlist(item.id);
    if (isInList) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const renderContent = () => {
    const items = searchResults.length > 0 ? searchResults : content;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-8">
        {items.map((item) => (
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
              <WatchlistButton
                isInWatchlist={isInWatchlist(item.id)}
                onToggleWatchlist={(e) => handleWatchlistToggle(item, e)}
                className={`w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="space-y-8 container mx-auto px-4">
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to MovieVerse
          </h1>
          <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover amazing movies and TV shows
          </p>

          <TrendingSection
            onFilterChange={handleFilterChange}
            activeFilter={contentFilter}
          />

          <GenreFilter
            mediaType={contentFilter === 'all' ? 'movie' : contentFilter}
            onGenreSelect={handleGenreSelect}
          />
        </section>

        <SearchBar onSearch={setSearchResults} />

        {error && (
          <div className={`text-center py-6 px-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
            <p className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {renderContent()}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-current border-t-transparent text-purple-500"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading more content...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
