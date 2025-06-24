import axios from 'axios';

const OMDB_BASE_URL = 'https://www.omdbapi.com';

const omdbApi = axios.create({
  baseURL: OMDB_BASE_URL,
  params: {
    apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY,
  },
});

export const getMovieRatings = async (imdbId) => {
  try {
    if (!imdbId) throw new Error('IMDB ID is required');
    
    const response = await omdbApi.get('/', {
      params: {
        i: imdbId,
      },
    });

    if (response.data.Error) {
      throw new Error(response.data.Error);
    }

    const { Ratings, imdbRating, imdbVotes } = response.data;
    return {
      imdbRating,
      imdbVotes,
      rottenTomatoesRating: Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A',
      metacriticRating: Ratings?.find(r => r.Source === 'Metacritic')?.Value || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching OMDB data:', error);
    throw error;
  }
};

export const searchByTitle = async (title, year) => {
  try {
    if (!title) throw new Error('Title is required');

    const params = {
      t: title,
      type: 'movie',
    };

    if (year) params.y = year;

    const response = await omdbApi.get('/', { params });

    if (response.data.Error) {
      throw new Error(response.data.Error);
    }

    return response.data;
  } catch (error) {
    console.error('Error searching OMDB:', error);
    throw error;
  }
};