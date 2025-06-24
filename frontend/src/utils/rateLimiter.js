class RateLimiter {
  constructor(maxRequests = 40, timeWindow = 10000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(now);
  }
}

// Create separate limiters for each API
export const tmdbLimiter = new RateLimiter(40, 10000); // 40 requests per 10 seconds
export const omdbLimiter = new RateLimiter(1000, 86400000); // 1000 requests per day