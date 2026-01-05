// // import { getPaginationParams, formatPaginatedResponse } from '@/lib/api/pagination';
// // import { rateLimit } from '@/lib/api/rateLimit';

// // const handler = async (req) => {
// //   if (req.method === 'GET') {
// //     const { searchParams } = new URL(req.url);
// //     const { page, limit, skip } = getPaginationParams(searchParams);
// //     const authorId = searchParams.get('authorId');

// //     try {
// //       const where = authorId ? { authorId } : {};

// //       const [posts, totalCount] = await Promise.all([
// //         prisma.post.findMany({
// //           where,
// //           include: {
// //             author: { select: { id: true, name: true, avatar: true } },
// //             _count: { select: { likes: true, comments: true } }
// //           },
// //           orderBy: { createdAt: 'desc' },
// //           skip,
// //           take: limit
// //         }),
// //         prisma.post.count({ where })
// //       ]);

// //       return Response.json(
// //         formatPaginatedResponse(posts, totalCount, page, limit),
// //         { status: 200 }
// //       );
// //     } catch (error) {
// //       console.error('Posts fetch error:', error);
// //       return Response.json(
// //         { error: 'Failed to fetch posts' },
// //         { status: 500 }
// //       );
// //     }
// //   }

// //   return Response.json({ error: 'Method not allowed' }, { status: 405 });
// // };

// // export const GET = rateLimit(100)(handler);

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
//     const limit = Math.min(100, parseInt(searchParams.get('limit')) || 20);
//     const skip = (page - 1) * limit;

//     const [posts, totalCount] = await Promise.all([
//       prisma.post.findMany({
//         include: {
//           author: { select: { id: true, name: true, avatar: true } },
//           _count: { select: { likes: true } }
//         },
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limit
//       }),
//       prisma.post.count()
//     ]);

//     return Response.json({
//       data: posts,
//       pagination: {
//         page,
//         limit,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit),
//         hasNextPage: page < Math.ceil(totalCount / limit)
//       }
//     });
//   } catch (error) {
//     return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       return Response.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { title, description, type, mediaUrl } = await req.json();
    
//     // Decode token to get userId (use verifyToken in production)
//     const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));

//     const post = await prisma.post.create({
//       data: {
//         title,
//         description,
//         type,
//         mediaUrl,
//         authorId: decoded.userId
//       }
//     });

//     return Response.json(post, { status: 201 });
//   } catch (error) {
//     return Response.json({ error: 'Failed to create post' }, { status: 500 });
//   }
// }

import prisma from '@/src/lib/db/prisma';
import { getPaginationParams, formatPaginatedResponse } from '@/src/lib/api/pagination';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { validatePostInput } from '@/src/lib/validation/posts';
import { createRateLimitMiddleware } from '@/src/lib/api/rateLimit';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

const getHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);
    const authorId = searchParams.get('authorId');

    const where = authorId ? { authorId } : {};

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, avatar: true } },
          _count: { select: { likes: true, comments: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    return new Response(
      JSON.stringify(formatPaginatedResponse(posts, totalCount, page, limit)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
};

const postHandler = async (req) => {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
    }

    const decoded = verifyAccessToken(token);
    const { title, description, type, mediaUrl } = await req.json();

    const { valid, errors } = validatePostInput(title, description, type, mediaUrl);
    if (!valid) {
      throw new ApiError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const post = await prisma.post.create({
      data: {
        title,
        description,
        type,
        mediaUrl,
        authorId: decoded.userId
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });

    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const GET = createRateLimitMiddleware(100)(getHandler);
export const POST = createRateLimitMiddleware(20)(postHandler);

