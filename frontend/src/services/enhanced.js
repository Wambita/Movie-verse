import { getMovieDetails, getTVDetails } from './tmdb';
import { getMovieById } from './omdb';

const formatRatings = (ratings) => {
  if (!ratings) return {};
  return ratings.reduce((acc, rating) => {
    acc[rating.Source.replace(/\s+/g, '')] = rating.Value;
    return acc;
  }, {});
};

export async function getEnhancedMovieDetails(tmdbId) {
  try {
    const tmdbData = await getMovieDetails(tmdbId);
    if (!tmdbData.imdb_id) return tmdbData;

    try {
      const omdbData = await getMovieById(tmdbData.imdb_id);
      return {
        ...tmdbData,
        ratings: formatRatings(omdbData.Ratings),
        metascore: omdbData.Metascore,
        imdbRating: omdbData.imdbRating,
      };
    } catch (error) {
      console.warn('Failed to fetch OMDB data:', error);
      return tmdbData;
    }
  } catch (error) {
    console.error('Failed to fetch enhanced movie details:', error);
    throw error;
  }
}

export async function getEnhancedTVDetails(tvId) {
  // For now, we only return TMDB data for TV shows as OMDB's TV data is limited
  return getTVDetails(tvId);
}