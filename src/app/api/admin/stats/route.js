// import prisma from '@/lib/db/prisma';
// import { verifyAccessToken } from '@/lib/auth/jwt';
// import { handleApiError, ApiError } from '@/lib/api/errorHandler';

// export async function GET(req) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
//     }

//     const decoded = verifyAccessToken(token);

//     if (decoded.role !== 'ADMIN') {
//       throw new ApiError('Forbidden', 403, 'NOT_ADMIN');
//     }

//     const [totalUsers, totalPosts, totalLikes, activeUsers] = await Promise.all([
//       prisma.user.count(),
//       prisma.post.count(),
//       prisma.like.count(),
//       prisma.user.count({
//         where: {
//           posts: {
//             some: {
//               createdAt: {
//                 gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
//               }
//             }
//           }
//         }
//       })
//     ]);

//     return new Response(
//       JSON.stringify({
//         totalUsers,
//         totalPosts,
//         totalLikes,
//         activeUsers,
//         timestamp: new Date().toISOString()
//       }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
    }

    const decoded = verifyAccessToken(token);

    if (decoded.role !== 'ADMIN') {
      throw new ApiError('Forbidden', 403, 'NOT_ADMIN');
    }

    // Get stats
    const [totalUsers, totalPosts, totalLikes, totalComments] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.like.count(),
      prisma.comment.count()
    ]);

    // Get active users (who posted in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await prisma.user.count({
      where: {
        posts: {
          some: {
            createdAt: { gte: sevenDaysAgo }
          }
        }
      }
    });

    // Get top posts
    const topPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { views: 'desc' },
      select: {
        id: true,
        title: true,
        views: true,
        _count: { select: { likes: true } }
      }
    });

    return new Response(
      JSON.stringify({
        totalUsers,
        totalPosts,
        totalLikes,
        totalComments,
        activeUsers,
        topPosts,
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

