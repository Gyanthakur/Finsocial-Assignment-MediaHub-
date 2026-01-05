// import prisma from '@/src/lib/db/prisma';
// import { verifyAccessToken } from '@/src/lib/auth/jwt';
// import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

// export async function DELETE(req, { params }) {
//   try {
//     const { id } = await params;
//     const authHeader = req.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
//     }

//     const decoded = verifyAccessToken(token);

//     if (decoded.role !== 'ADMIN') {
//       throw new ApiError('Forbidden', 403, 'NOT_ADMIN');
//     }

//     await prisma.user.delete({ where: { id } });

//     return new Response(
//       JSON.stringify({ success: true }),
//       { status: 200, headers: { 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     return handleApiError(error);
//   }
// }
import prisma from '@/src/lib/db/prisma';
import { verifyAccessToken } from '@/src/lib/auth/jwt';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError('Unauthorized', 401, 'NO_TOKEN');
    }

    const decoded = verifyAccessToken(token);

    // Only admins can delete users
    if (decoded.role !== 'ADMIN') {
      throw new ApiError('Forbidden', 403, 'NOT_ADMIN');
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Prevent deleting yourself
    if (decoded.userId === id) {
      throw new ApiError('Cannot delete your own account', 400, 'CANNOT_DELETE_SELF');
    }

    // Delete user and related data (cascade handled by Prisma)
    await prisma.user.delete({ where: { id } });

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

