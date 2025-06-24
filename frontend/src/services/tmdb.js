import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

export const getImageUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const searchMulti = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching TMDB:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getTVDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,videos,similar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV details:', error);
    throw error;
  }
};

export const getTrending = async (mediaType = 'all', timeWindow = 'day') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw error;
  }
};