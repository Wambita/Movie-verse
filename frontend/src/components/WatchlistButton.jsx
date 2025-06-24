import React from 'react';

const WatchlistButton = ({ isInWatchlist, onToggleWatchlist, className = '' }) => {
  return (
    <button
      onClick={onToggleWatchlist}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isInWatchlist
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-blue-500 hover:bg-blue-600 text-white'
        } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {isInWatchlist ? (
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        )}
      </svg>
      <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
    </button>
  );
};

export default WatchlistButton;