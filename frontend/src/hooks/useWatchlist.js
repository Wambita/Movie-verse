import { useState, useEffect } from "react";

const STORAGE_KEY = "watchlist";

const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  // Load safely
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setWatchlist(parsed.slice(0, 100)); // limit safety
      }
    } catch (err) {
      console.error("Failed to load watchlist:", err);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save safely (WITH PROTECTION)
  useEffect(() => {
    try {
      const trimmed = watchlist.slice(-100); // HARD LIMIT

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.warn("localStorage full — trimming watchlist");

      // emergency fallback: keep only last 20
      const reduced = watchlist.slice(-20);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
        setWatchlist(reduced);
      } catch (e) {
        console.error("localStorage still failing:", e);
      }
    }
  }, [watchlist]);

  const addToWatchlist = (media) => {
    setWatchlist((prev) => {
      if (prev.some((item) => item.id === media.id)) return prev;

      const safeItem = {
        id: media.id,
        title: media.title || media.name,
        poster_path: media.poster_path || null,
        type: media.media_type || (media.first_air_date ? "tv" : "movie"),
        added_at: Date.now(),
      };

      return [...prev, safeItem];
    });
  };

  const removeFromWatchlist = (mediaId) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== mediaId));
  };

  const isInWatchlist = (mediaId) => {
    return watchlist.some((item) => item.id === mediaId);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};

export default useWatchlist;