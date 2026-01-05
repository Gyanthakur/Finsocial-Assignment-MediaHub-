// import prisma from '@/src/lib/db/prisma';
// import { verifyAccessToken } from '@/src/lib/auth/jwt';
// import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

// export async function GET(req, { params }) {
//   try {
//     const { id } = await params;

//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         bio: true,
//         avatar: true,
//         createdAt: true,
//         role: true,
//         _count: {
//           select: {
//             posts: true,
//             likes: true
//           }
//         }
//       }
//     });

//     if (!user) {
//       throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
//     }

//     // Get user's total likes received on all posts
//     const posts = await prisma.post.findMany({
//       where: { authorId: id },
//       include: {
//         _count: { select: { likes: true } }
//       }
//     });

//     const totalLikes = posts.reduce((sum, post) => sum + post._count.likes, 0);

//     return new Response(
//       JSON.stringify({
//         ...user,
//         postsCount: user._count.posts,
//         totalLikes
//       }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

// export async function PUT(req, { params }) {
//   try {
//     const { id } = await params;
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
//     }

//     const decoded = verifyAccessToken(token);

//     // Users can only update their own profile
//     if (decoded.userId !== id) {
//       throw new ApiError('Forbidden', 403, 'NOT_AUTHORIZED');
//     }

//     const { name, bio } = await req.json();

//     const user = await prisma.user.update({
//       where: { id },
//       data: {
//         ...(name && { name }),
//         ...(bio && { bio })
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         bio: true,
//         avatar: true,
//         createdAt: true,
//         role: true
//       }
//     });

//     return new Response(
//       JSON.stringify(user),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            posts: true,
            likes: true
          }
        }
      }
    });

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Get total likes received on user's posts
    const posts = await prisma.post.findMany({
      where: { authorId: id },
      include: {
        _count: { select: { likes: true } }
      }
    });

    const totalLikes = posts.reduce((sum, post) => sum + (post._count?.likes || 0), 0);

    return new Response(
      JSON.stringify({
        ...user,
        postsCount: user._count.posts,
        totalLikes
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
    }

    const decoded = verifyAccessToken(token);

    // Users can only update their own profile
    if (decoded.userId !== id) {
      throw new ApiError('Forbidden', 403, 'NOT_AUTHORIZED');
    }

    const { name, bio } = await req.json();

    if (name && name.trim().length < 2) {
      throw new ApiError('Name must be at least 2 characters', 400, 'INVALID_NAME');
    }

    if (bio && bio.length > 500) {
      throw new ApiError('Bio must not exceed 500 characters', 400, 'BIO_TOO_LONG');
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(bio && { bio: bio.trim() })
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        avatar: true,
        createdAt: true,
        role: true
      }
    });

    return new Response(
      JSON.stringify(user),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

