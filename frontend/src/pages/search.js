import React, { useState } from "react";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/search?query=${query}`
      );

      const data = await res.json();

      // IMPORTANT: normalize to array
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-6">Search Movies</h1>

      <SearchBar onSearch={handleSearch} />

      <SearchResults results={searchResults} loading={loading} />

      {!searchResults.length && (
        <p className="text-center mt-10 text-gray-500">
          Start typing to search for movies...
        </p>
      )}
    </Layout>
  );
};

export default SearchPage;