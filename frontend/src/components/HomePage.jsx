import React, { useState, useEffect, useCallback } from 'react';
import { getTrending } from '../services/tmdb';
import { getEnhancedMovieDetails } from '../services/enhanced';
import { debounce } from '../utils/debounce';

const HomePage = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrendingContent = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrending(pageNum);
      const enhancedData = await Promise.all(
        data.results.map(async (item) => {
          if (item.media_type === 'movie') {
            const enhanced = await getEnhancedMovieDetails(item.id);
            return { ...item, ...enhanced };
          }
          return item;
        })
      );
      setTrendingContent(prev => pageNum === 1 ? enhancedData : [...prev, ...enhancedData]);
    } catch (err) {
      setError('Failed to fetch trending content');
    } finally {
      setLoading(false);
    }
  };

  const debouncedScroll = useCallback(
    debounce(() => {
      if (window.innerHeight + document.documentElement.scrollTop
          === document.documentElement.offsetHeight) {
        setPage(prev => prev + 1);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchTrendingContent(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [debouncedScroll]);

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to MovieVerse
        </h1>
        <p className="text-lg opacity-75">
          Discover trending movies and TV shows
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingContent.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="bg-opacity-40 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-[400px] object-cover"
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
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default HomePage;