const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'your_omdb_api_key';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

import { getCachedData, setCachedData } from '../utils/cache';
import { omdbLimiter } from '../utils/rateLimiter';

async function fetchFromOMDB(params = {}, cacheTime = 24 * 60 * 60 * 1000) { // 24 hours cache
  const queryString = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...params
  }).toString();

  const cacheKey = `omdb_${queryString}`;
  const cachedData = getCachedData(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    await omdbLimiter.checkLimit();
    const response = await fetch(`${OMDB_BASE_URL}?${queryString}`);

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limit exceeded
        const retryAfter = 5; // OMDB doesn't provide Retry-After header
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        return fetchFromOMDB(params, cacheTime);
      }
      throw new Error(`OMDB API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data.Error) {
      throw new Error(`OMDB API Error: ${data.Error}`);
    }
    
    setCachedData(cacheKey, data, cacheTime);
    return data;
  } catch (error) {
    console.error('Error fetching from OMDB:', error);
    throw error;
  }
}

export async function getMovieByTitle(title) {
  return fetchFromOMDB({ t: title });
}

export async function getMovieById(imdbId) {
  return fetchFromOMDB({ i: imdbId });
}