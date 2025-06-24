import { getMovieDetails, getTVDetails } from './tmdb';
import { getMovieRatings } from './omdb';

export const getEnhancedMovieDetails = async (movieId) => {
  try {
    // Get basic movie details from TMDB
    const movieDetails = await getMovieDetails(movieId);

    // If movie has IMDB ID, get additional ratings from OMDB
    let ratings = null;
    if (movieDetails.imdb_id) {
      try {
        ratings = await getMovieRatings(movieDetails.imdb_id);
      } catch (omdbError) {
        console.warn('Failed to fetch OMDB ratings:', omdbError);
        // Continue without OMDB data if there's an error
      }
    }

    return {
      ...movieDetails,
      enhanced_ratings: ratings,
    };
  } catch (error) {
    console.error('Error fetching enhanced movie details:', error);
    throw error;
  }
};

export const getEnhancedTVDetails = async (tvId) => {
  try {
    // For TV shows, we only have TMDB data as OMDB mainly focuses on movies
    const tvDetails = await getTVDetails(tvId);

    return {
      ...tvDetails,
      enhanced_ratings: {
        imdbRating: tvDetails.vote_average,
        imdbVotes: tvDetails.vote_count,
        rottenTomatoesRating: 'N/A',
        metacriticRating: 'N/A',
      },
    };
  } catch (error) {
    console.error('Error fetching enhanced TV details:', error);
    throw error;
  }
};

export const formatRating = (rating) => {
  if (!rating || rating === 'N/A') return 'N/A';
  
  // Handle percentage ratings (Rotten Tomatoes)
  if (typeof rating === 'string' && rating.includes('%')) {
    return rating;
  }

  // Handle decimal ratings (IMDB)
  const numRating = parseFloat(rating);
  if (!isNaN(numRating)) {
    return numRating.toFixed(1);
  }

  return rating;
};