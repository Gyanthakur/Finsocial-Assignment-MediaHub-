// import { verifyAccessToken } from './jwt';

// export const authMiddleware = (handler) => {
//   return async (req) => {
//     const authHeader = req.headers.get('authorization');
    
//     if (!authHeader) {
//       return Response.json(
//         { error: 'Missing authorization header' },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.replace('Bearer ', '');

//     try {
//       const decoded = verifyAccessToken(token);
//       req.user = decoded;
//       return handler(req);
//     } catch (error) {
//       return Response.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }
//   };
// };

// export const adminMiddleware = (handler) => {
//   return authMiddleware(async (req) => {
//     if (req.user.role !== 'ADMIN') {
//       return Response.json(
//         { error: 'Admin access required' },
//         { status: 403 }
//       );
//     }
//     return handler(req);
//   });
// };

import { verifyAccessToken } from './jwt';

export const withAuth = (handler, requireRole = null) => {
  return async (req) => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return new Response(
          JSON.stringify({ error: 'Missing authorization token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const decoded = verifyAccessToken(token);

      if (requireRole && decoded.role !== requireRole) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      req.user = decoded;
      return await handler(req);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message || 'Authentication failed' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
};

export const withAdminAuth = (handler) => {
  return withAuth(handler, 'ADMIN');
};

export const extractUserFromRequest = (req) => {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return null;
    return verifyAccessToken(token);
  } catch {
    return null;
  }
};
