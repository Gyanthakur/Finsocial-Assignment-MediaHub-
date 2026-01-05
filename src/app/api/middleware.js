import { verifyAccessToken } from '@/lib/auth/jwt';

const rateLimitMap = new Map();
const MAX_REQUESTS = 100;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function withRateLimit(handler, maxRequests = MAX_REQUESTS) {
  return async (req) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const key = `${ip}-${req.nextUrl.pathname}`;
    
    const now = Date.now();
    const userRequests = rateLimitMap.get(key) || [];
    
    // Clean old requests
    const recentRequests = userRequests.filter(
      time => now - time < WINDOW_MS
    );
    
    if (recentRequests.length >= maxRequests) {
      return Response.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: { 'Retry-After': '900' }
        }
      );
    }
    
    recentRequests.push(now);
    rateLimitMap.set(key, recentRequests);
    
    return handler(req);
  };
}

export function withAuth(handler, requireAdmin = false) {
  return async (req) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = verifyAccessToken(token);
      
      if (requireAdmin && decoded.role !== 'ADMIN') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }

      req.user = decoded;
      return handler(req);
    } catch (error) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
}
