import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { getPaginationParams, formatPaginatedResponse } from '@/src/lib/api/pagination';
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

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(searchParams);

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { posts: true, likes: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count()
    ]);

    return new Response(
      JSON.stringify(formatPaginatedResponse(users, totalCount, page, limit)),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}