const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'your_tmdb_api_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB(endpoint, params = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });

  try {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);
    if (!response.ok) throw new Error('TMDB API request failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
}

export async function getTrending(page = 1) {
  return fetchFromTMDB('/trending/all/day', { page });
}

export async function searchMovies(query, page = 1) {
  return fetchFromTMDB('/search/movie', { query, page });
}

export async function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}`);
}

export async function getTVDetails(tvId) {
  return fetchFromTMDB(`/tv/${tvId}`);
}