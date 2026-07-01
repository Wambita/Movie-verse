import React, { useState, useMemo } from "react";
import { useRouter } from "next/router";
import useWatchlist from "../hooks/useWatchlist";
import WatchlistButton from "../components/WatchlistButton";
import placeholderImage from "../assets/placeholder.svg";
import Layout from "../components/Layout";

const WatchlistPage = () => {
  const router = useRouter();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [filter, setFilter] = useState("all");

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null;
  };

  const handleItemClick = (item) => {
    router.push(`/${item.type}/${item.id}`);
  };

  // ✅ SAFE + STABLE DERIVED DATA
  const filteredWatchlist = useMemo(() => {
    if (!Array.isArray(watchlist)) return [];

    return watchlist
      .filter((item) => {
        if (filter === "all") return true;
        return item.type === filter;
      })
      .sort((a, b) => {
        const aTime = a.added_at || 0;
        const bTime = b.added_at || 0;
        return bTime - aTime;
      });
  }, [watchlist, filter]);

  const filters = [
    { id: "all", label: "All" },
    { id: "movie", label: "Movies" },
    { id: "tv", label: "TV Shows" },
  ];

  const handleRemove = (item, e) => {
    e.stopPropagation();
    removeFromWatchlist(item.id);
  };

  return (
  <Layout>
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* HEADER */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Watchlist
        </h1>

        {/* FILTERS */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full transition ${
                filter === f.id
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* EMPTY STATE */}
      {filteredWatchlist.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {filter === "all"
            ? "Your watchlist is empty. Start adding movies and TV shows!"
            : `No ${filter} items in your watchlist yet.`}
        </div>
      ) : (
        /* GRID */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredWatchlist.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              {/* IMAGE + CLICK */}
              <div
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : placeholderImage
                    }
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>

                {/* TEXT */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    <span className="capitalize">{item.type}</span>
                    <span> • </span>
                    <span>
                      {item.added_at
                        ? `Added ${new Date(item.added_at).toLocaleDateString()}`
                        : "Recently added"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="px-4 pb-4">
                <WatchlistButton
                  isInWatchlist={true}
                  onToggleWatchlist={(e) => handleRemove(item, e)}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </Layout>
  );
  
};

export default WatchlistPage;