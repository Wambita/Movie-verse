/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org'], // Allow images from TMDB
  },
  env: {
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
    NEXT_PUBLIC_OMDB_API_KEY: process.env.NEXT_PUBLIC_OMDB_API_KEY,
  },
};

module.exports = nextConfig;