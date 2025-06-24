import { fetchFromTMDB } from './tmdb';

// Fetch all available movie genres
export async function getMovieGenres() {
  return fetchFromTMDB('/genre/movie/list');
}

// Fetch all available TV show genres
export async function getTVGenres() {
  return fetchFromTMDB('/genre/tv/list');
}

// Discover movies by genre
export async function discoverMoviesByGenre(genreId, page = 1) {
  return fetchFromTMDB('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  });
}

// Discover TV shows by genre
export async function discoverTVByGenre(genreId, page = 1) {
  return fetchFromTMDB('/discover/tv', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  });
}