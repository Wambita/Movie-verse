import React, { useState, useEffect } from 'react';
import { getMovieGenres, getTVGenres } from '../services/genres';

const GenreFilter = ({ mediaType, onGenreSelect }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = mediaType === 'movie' ? await getMovieGenres() : await getTVGenres();
        setGenres(data.genres);
      } catch (err) {
        console.error('Error fetching genres:', err);
        setError('Failed to load genres');
      } finally {
        setLoading(false);
      }
    };

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
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => handleGenreClick(genre)}
          className={`px-4 py-2 rounded-full transition-colors ${selectedGenre?.id === genre.id
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;