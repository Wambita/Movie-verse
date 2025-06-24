import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getTrending } from '../services/tmdb';
import { getEnhancedMovieDetails } from '../services/enhanced';
import { throttle } from '../utils/debounce';
import SearchBar from './SearchBar';
import placeholderImage from '../assets/placeholder.svg';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const [trendingContent, setTrendingContent] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const loadingRef = useRef(false);
  const maxRetries = 3;

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const handleItemClick = (item) => {
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    router.push(`/${type}/${item.id}`);
  };

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

  const renderContent = () => {
    const items = searchResults.length > 0 ? searchResults : trendingContent;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="bg-opacity-40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
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
    );
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to MovieVerse
        </h1>
        <p className="text-lg opacity-75 mb-8">
          Discover amazing movies and TV shows
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar onSearchResults={setSearchResults} />
        </div>
      </section>

      <section className="px-4">
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          renderContent()
        )}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!hasMore && !loading && !error && (
          <div className="text-center py-8 opacity-75">
            No more content to load
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;