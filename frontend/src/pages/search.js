import React, { useState } from 'react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Search Movies
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find your favorite movies and discover new ones
          </p>
        </div>

        <SearchBar onResultsChange={setSearchResults} />
        <SearchResults results={searchResults} />

        {searchResults.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500 dark:text-gray-400">
              Start typing to search for movies...
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;