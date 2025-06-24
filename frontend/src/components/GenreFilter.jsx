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