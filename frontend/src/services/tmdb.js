import { getCachedData, setCachedData } from '../utils/cache';
import { tmdbLimiter } from '../utils/rateLimiter';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error('TMDB API key is not set in environment variables');
}

async function fetchFromTMDB(endpoint, params = {}, cacheTime = 5 * 60 * 1000) {
  const queryString = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  }).toString();

  const cacheKey = `tmdb_${endpoint}_${queryString}`;
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    await tmdbLimiter.checkLimit();
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryString}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit exceeded
        const retryAfter = response.headers.get('Retry-After') || 10;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return fetchFromTMDB(endpoint, params, cacheTime);
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    setCachedData(cacheKey, data, cacheTime);
    return data;
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    throw error;
  }
}

export async function getTrending(page = 1) {
  return fetchFromTMDB('/trending/all/day', { page });
}

export async function searchMovies(query, page = 1) {
  return fetchFromTMDB('/search/movie', { query: query.toLowerCase(), page });
}

export async function getMovieDetails(movieId) {
  const [details, credits, videos, similar] = await Promise.all([
    fetchFromTMDB(`/movie/${movieId}`, { append_to_response: 'videos,images' }),
    fetchFromTMDB(`/movie/${movieId}/credits`),
    fetchFromTMDB(`/movie/${movieId}/videos`),
    fetchFromTMDB(`/movie/${movieId}/similar`)
  ]);
  return { ...details, credits, videos, similar };
}

export async function getTVDetails(tvId) {
  const [details, credits, videos, similar] = await Promise.all([
    fetchFromTMDB(`/tv/${tvId}`, { append_to_response: 'videos,images' }),
    fetchFromTMDB(`/tv/${tvId}/credits`),
    fetchFromTMDB(`/tv/${tvId}/videos`),
    fetchFromTMDB(`/tv/${tvId}/similar`)
  ]);
  return { ...details, credits, videos, similar };
}

export async function getMediaDetails(id, mediaType) {
  return mediaType === 'movie' ? getMovieDetails(id) : getTVDetails(id);
}