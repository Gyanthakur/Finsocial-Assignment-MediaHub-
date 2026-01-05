import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import { handleApiError, ApiError } from '@/lib/api/errorHandler';
import prisma from '@/lib/db/prisma';

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      throw new ApiError('Refresh token required', 400, 'MISSING_REFRESH_TOKEN');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    const accessToken = generateAccessToken(user.id, user.role, user.email);

    return new Response(
      JSON.stringify({ accessToken }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error, 401);
  }
}
