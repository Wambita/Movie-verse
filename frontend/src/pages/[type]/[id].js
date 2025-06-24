import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MediaDetails from '../../components/MediaDetails';
import { getMediaDetails } from '../../services/tmdb';
import useWatchlist from '../../hooks/useWatchlist';

const MediaDetailsPage = () => {
  const router = useRouter();
  const { type, id } = router.query;
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!id || !type) return;

      try {
        setLoading(true);
        setError(null);
        const details = await getMediaDetails(id, type);
        setMedia({ ...details, media_type: type });
      } catch (err) {
        setError('Failed to load media details. Please try again later.');
        console.error('Error fetching media details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaDetails();
  }, [id, type]);

  const handleWatchlistToggle = (mediaItem) => {
    if (isInWatchlist(mediaItem.id)) {
      removeFromWatchlist(mediaItem.id);
    } else {
      addToWatchlist(mediaItem);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!media) return null;

  return (
    <MediaDetails
      media={media}
      onAddToWatchlist={handleWatchlistToggle}
      isInWatchlist={isInWatchlist(media.id)}
    />
  );
};

export default MediaDetailsPage;