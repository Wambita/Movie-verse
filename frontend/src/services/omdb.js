const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'your_omdb_api_key';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

async function fetchFromOMDB(params = {}) {
  const queryParams = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...params
  });

  try {
    const response = await fetch(`${OMDB_BASE_URL}?${queryParams}`);
    if (!response.ok) throw new Error('OMDB API request failed');
    return await response.json();
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