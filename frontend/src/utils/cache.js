const CACHE_PREFIX = 'movieverse_cache_';
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

export const cacheKey = (key) => `${CACHE_PREFIX}${key}`;

export const getCachedData = (key) => {
  try {
    const item = localStorage.getItem(cacheKey(key));
    if (!item) return null;

    const { value, timestamp, expiresIn } = JSON.parse(item);
    if (Date.now() - timestamp > expiresIn) {
      localStorage.removeItem(cacheKey(key));
      return null;
    }

    return value;
  } catch (error) {
    console.warn('Error reading from cache:', error);
    return null;
  }
};

export const setCachedData = (key, value, expiresIn = DEFAULT_CACHE_TIME) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
      expiresIn,
    };
    localStorage.setItem(cacheKey(key), JSON.stringify(item));
  } catch (error) {
    console.warn('Error writing to cache:', error);
  }
};

export const clearCache = (prefix = CACHE_PREFIX) => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
};