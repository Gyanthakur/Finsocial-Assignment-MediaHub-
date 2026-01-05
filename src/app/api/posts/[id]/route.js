
import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

const getHandler = async (req, { params }) => {
  try {
    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        likes: { select: { userId: true } },
        comments: {
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!post) {
      throw new ApiError('Post not found', 404, 'POST_NOT_FOUND');
    }

    // Increment view count
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
};

const deleteHandler = async (req, { params }) => {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
    }

    const decoded = verifyAccessToken(token);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new ApiError('Post not found', 404, 'POST_NOT_FOUND');
    }

    // Check if user is author or admin
    if (post.authorId !== decoded.userId && decoded.role !== 'ADMIN') {
      throw new ApiError('Forbidden', 403, 'NOT_AUTHORIZED');
    }

    await prisma.post.delete({ where: { id } });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const GET = getHandler;
export const DELETE = deleteHandler;
