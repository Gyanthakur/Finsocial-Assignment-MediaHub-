

const rateLimitStore = new Map();
const CLEANUP_INTERVAL = 60 * 1000; // Clean up every minute

// Start cleanup interval
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitStore.entries()) {
    const recentRequests = requests.filter(time => now - time < 15 * 60 * 1000);
    if (recentRequests.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recentRequests);
    }
  }
}, CLEANUP_INTERVAL);

export const checkRateLimit = (ip, endpoint, maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const userRequests = rateLimitStore.get(key) || [];
  
  // Filter requests within the window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    const oldestRequest = Math.min(...recentRequests);
    const resetTime = new Date(oldestRequest + windowMs);
    return {
      allowed: false,
      remaining: 0,
      resetTime: resetTime.toISOString(),
      retryAfter: Math.ceil((resetTime - now) / 1000)
    };
  }
  
  recentRequests.push(now);
  rateLimitStore.set(key, recentRequests);
  
  return {
    allowed: true,
    remaining: maxRequests - recentRequests.length,
    resetTime: new Date(now + windowMs).toISOString(),
    retryAfter: null
  };
};

export const createRateLimitMiddleware = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (handler) => {
    return async (req) => {
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
      const endpoint = req.nextUrl.pathname;
      
      const rateLimitResult = checkRateLimit(ip, endpoint, maxRequests, windowMs);
      
      if (!rateLimitResult.allowed) {
        return new Response(
          JSON.stringify({ 
            error: 'Too many requests',
            retryAfter: rateLimitResult.retryAfter,
            resetTime: rateLimitResult.resetTime
          }),
          { 
            status: 429,
            headers: {
              'Retry-After': String(rateLimitResult.retryAfter),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      const response = await handler(req);
      const headers = new Headers(response.headers);
      headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
      headers.set('X-RateLimit-Reset', rateLimitResult.resetTime);
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    };
  };
};


