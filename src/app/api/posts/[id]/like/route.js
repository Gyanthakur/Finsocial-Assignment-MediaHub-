import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

export async function POST(req, { params }) {
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

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId: decoded.userId, postId: id } }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { userId_postId: { userId: decoded.userId, postId: id } }
      });
    } else {
      await prisma.like.create({
        data: { userId: decoded.userId, postId: id }
      });
    }

    const likeCount = await prisma.like.count({ where: { postId: id } });

    return new Response(JSON.stringify({ success: true, likeCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
