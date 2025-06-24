const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'your_tmdb_api_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

import { getCachedData, setCachedData } from '../utils/cache';
import { tmdbLimiter } from '../utils/rateLimiter';

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
      throw new Error(`TMDB API request failed: ${response.status}`);
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
  return fetchFromTMDB('/search/movie', { query, page });
}

export async function getMovieDetails(movieId) {
  return fetchFromTMDB(`/movie/${movieId}`);
}

export async function getTVDetails(tvId) {
  return fetchFromTMDB(`/tv/${tvId}`);
}