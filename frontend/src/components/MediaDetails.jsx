import React, { useState } from 'react';
import placeholderImage from '../assets/placeholder.svg';

const MediaDetails = ({ media, onAddToWatchlist, isInWatchlist }) => {
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const getTrailer = () => {
    return media.videos?.results?.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Release date unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster and Basic Info */}
        <div className="lg:w-1/3">
          <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img
              src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : placeholderImage}
              alt={media.title || media.name}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
          </div>
          <button
            onClick={() => onAddToWatchlist(media)}
            className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${isInWatchlist ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>

        {/* Details */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{media.title || media.name}</h1>
          
          <div className="flex items-center gap-4 mb-4 text-sm opacity-75">
            <span>{formatDate(media.release_date || media.first_air_date)}</span>
            {media.vote_average && (
              <span>Rating: {media.vote_average.toFixed(1)} ⭐</span>
            )}
            {media.runtime && (
              <span>{Math.floor(media.runtime / 60)}h {media.runtime % 60}m</span>
            )}
          </div>

          <p className="text-lg mb-6">{media.overview}</p>

          {/* Genres */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {media.genres?.map(genre => (
                <span key={genre.id} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.credits?.cast?.slice(0, 6).map(person => (
                <div key={person.id} className="text-center">
                  <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden mb-2">
                    <img
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : placeholderImage}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-sm opacity-75">{person.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trailer */}
          {getTrailer() && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Trailer</h2>
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getTrailer().key}`}
                  title="Trailer"
                  className="absolute inset-0 w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Similar Content */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Similar {media.media_type === 'movie' ? 'Movies' : 'Shows'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.similar?.results?.slice(0, 6).map(item => (
                <div key={item.id} className="cursor-pointer">
                  <div className="relative aspect-[2/3] bg-gray-800 rounded-lg overflow-hidden mb-2">
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : placeholderImage}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{item.title || item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;