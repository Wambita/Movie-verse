import React, { useState } from 'react';
import { searchMulti } from '../services/tmdb';
import { getEnhancedMovieDetails, getEnhancedTVDetails } from '../services/enhanced';

const APITest = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [detailedContent, setDetailedContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMulti('Inception');
      setSearchResults(results);
      
      // Get detailed info for the first result
      if (results.results?.length > 0) {
        const firstItem = results.results[0];
        const details = firstItem.media_type === 'movie'
          ? await getEnhancedMovieDetails(firstItem.id)
          : await getEnhancedTVDetails(firstItem.id);
        setDetailedContent(details);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Integration Test</h1>
      
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test API Integration'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {searchResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        </div>
      )}

      {detailedContent && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Detailed Content</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(detailedContent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default APITest;