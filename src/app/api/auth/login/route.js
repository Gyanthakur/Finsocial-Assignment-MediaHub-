// // import { PrismaClient } from '@prisma/client';
// // import { hashPassword, comparePassword } from '@/lib/auth/password';
// // import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
// // import { rateLimit } from '@/lib/api/rateLimit';

// // const prisma = new PrismaClient();

// // const handler = async (req) => {
// //   if (req.method !== 'POST') {
// //     return Response.json({ error: 'Method not allowed' }, { status: 405 });
// //   }

// //   const { email, password } = await req.json();

// //   if (!email || !password) {
// //     return Response.json(
// //       { error: 'Email and password required' },
// //       { status: 400 }
// //     );
// //   }

// //   try {
// //     const user = await prisma.user.findUnique({ where: { email } });

// //     if (!user || !(await comparePassword(password, user.password))) {
// //       return Response.json(
// //         { error: 'Invalid credentials' },
// //         { status: 401 }
// //       );
// //     }

// //     const accessToken = generateAccessToken(user.id, user.role);
// //     const refreshToken = generateRefreshToken(user.id);

// //     return Response.json(
// //       {
// //         accessToken,
// //         refreshToken,
// //         user: { id: user.id, email: user.email, role: user.role }
// //       },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     return Response.json(
// //       { error: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // };

// // export const POST = rateLimit(5, 15 * 60 * 1000)(handler);

// import { PrismaClient } from '@prisma/client';
// import { comparePassword } from '@/lib/auth/password';
// import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';

// const prisma = new PrismaClient();

// export async function POST(req) {
//   try {
//     const { email, password } = await req.json();

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user || !(await comparePassword(password, user.password))) {
//       return Response.json({ error: 'Invalid credentials' }, { status: 401 });
//     }

//     const accessToken = generateAccessToken(user.id, user.role);
//     const refreshToken = generateRefreshToken(user.id);

//     return Response.json({
//       accessToken,
//       refreshToken,
//       user: { id: user.id, email: user.email, role: user.role }
//     });
//   } catch (error) {
//     return Response.json({ error: 'Login failed' }, { status: 500 });
//   }
// }
// import prisma from '@/lib/db/prisma';
import prisma from '@/src/lib/db/prisma';
import { comparePassword } from '@/src/lib/auth/password';
import { generateTokenPair } from '@/src/lib/auth/jwt';
import { validateLoginInput } from '@/src/lib/validation/auth';
import { createRateLimitMiddleware } from '@/src/lib/api/rateLimit';
import { handleApiError, ApiError } from '@/src/lib/api/errorHandler';

const handler = async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { email, password } = await req.json();

    const { valid, errors } = validateLoginInput(email, password);
    if (!valid) {
      throw new ApiError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokenPair(user.id, user.role, user.email);

    return new Response(
      JSON.stringify({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = createRateLimitMiddleware(5, 15 * 60 * 1000)(handler);

