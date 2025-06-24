import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending } from '../services/tmdb';
import { getEnhancedMovieDetails } from '../services/enhanced';
import { throttle } from '../utils/debounce';
import SearchBar from './SearchBar';

const HomePage = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const loadingRef = useRef(false);
  const maxRetries = 3;

  const fetchTrendingContent = async (pageNum) => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      
      const data = await getTrending(pageNum);
      const enhancedData = await Promise.allSettled(
        data.results.map(async (item) => {
          if (item.media_type === 'movie') {
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

      setTrendingContent(prev => pageNum === 1 ? processedData : [...prev, ...processedData]);
      setHasMore(data.page < data.total_pages);
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (err) {
      console.error('Error fetching trending content:', err);
      setError(
        retryCount < maxRetries
          ? 'Failed to fetch content. Retrying...'
          : 'Failed to fetch content. Please try again later.'
      );
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchTrendingContent(pageNum), 2000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const handleScroll = useCallback(
    throttle(() => {
      if (searchResults.length > 0) return; // Disable infinite scroll during search
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
      fetchTrendingContent(page);
    }
  }, [page, searchResults.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to MovieVerse
        </h1>
        <p className="text-lg opacity-75 mb-8">
          Discover trending movies and TV shows
        </p>
        <div className="max-w-2xl mx-auto px-4">
          <SearchBar onResultsChange={setSearchResults} />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(searchResults.length > 0 ? searchResults : trendingContent).map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="bg-opacity-40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.title || item.name}</h3>
              <div className="flex items-center space-x-2 text-sm opacity-75">
                <span>{new Date(item.release_date || item.first_air_date).getFullYear()}</span>
                {item.vote_average && (
                  <span>• {item.vote_average.toFixed(1)} ⭐</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4 space-y-2">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500">
              Retry attempt {retryCount} of {maxRetries}...
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">{error}</p>
          {retryCount >= maxRetries && (
            <button
              onClick={() => {
                setRetryCount(0);
                setError(null);
                fetchTrendingContent(page);
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {!hasMore && !loading && !error && (
        <div className="text-center py-4 text-gray-500">
          No more content to load
        </div>
      )}
    </div>
  );
};

export default HomePage;