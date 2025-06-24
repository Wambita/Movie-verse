import { useState, useEffect } from 'react';

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error parsing watchlist from localStorage:', error);
        localStorage.removeItem('watchlist');
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (media) => {
    setWatchlist(prev => {
      if (prev.some(item => item.id === media.id)) return prev;
      return [...prev, {
        id: media.id,
        title: media.title || media.name,
        poster_path: media.poster_path,
        media_type: media.media_type,
        added_at: new Date().toISOString()
      }];
    });
  };

  const removeFromWatchlist = (mediaId) => {
    setWatchlist(prev => prev.filter(item => item.id !== mediaId));
  };

  const isInWatchlist = (mediaId) => {
    return watchlist.some(item => item.id === mediaId);
  };

  const getWatchlist = () => watchlist;

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlist
  };
};

export default useWatchlist;