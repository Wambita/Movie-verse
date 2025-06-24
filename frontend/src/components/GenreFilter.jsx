import React, { useState, useEffect } from 'react';
import { getMovieGenres, getTVGenres } from '../services/genres';
import { useTheme } from '../features/theme/ThemeContext';

const GenreFilter = ({ mediaType, onGenreSelect }) => {
  const { theme } = useTheme();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const fetchGenres = async () => {
    if (!mediaType) return;
    
    try {
      setLoading(true);
      setError(null);
      setSelectedGenre(null); // Reset selected genre when media type changes
      const data = mediaType === 'movie' ? await getMovieGenres() : await getTVGenres();
      if (!data || !data.genres) {
        throw new Error('Invalid response format from API');
      }
      setGenres(data.genres);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError(err.message || 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [mediaType]);

  const handleGenreClick = (genre) => {
    const newSelectedGenre = selectedGenre?.id === genre.id ? null : genre;
    setSelectedGenre(newSelectedGenre);
    onGenreSelect(newSelectedGenre);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-current border-t-transparent text-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 px-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-500'}`}>
        <p className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
        <button
          onClick={() => fetchGenres()}
          className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className={`text-xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {mediaType === 'movie' ? 'Movie' : 'TV Show'} Genres
      </h2>
      <div className="flex flex-wrap justify-center gap-2 py-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre)}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              selectedGenre?.id === genre.id
                ? 'bg-purple-600 text-white transform scale-105 shadow-lg shadow-purple-500/25'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;