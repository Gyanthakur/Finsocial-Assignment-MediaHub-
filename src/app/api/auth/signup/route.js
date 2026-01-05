// import { PrismaClient } from '@prisma/client';
// import { hashPassword } from '@/lib/auth/password';
// import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';

// const prisma = new PrismaClient();

// export async function POST(req) {
//   try {
//     const { email, password, name } = await req.json();

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//       return Response.json({ error: 'User already exists' }, { status: 400 });
//     }

//     // Create user
//     const hashedPassword = await hashPassword(password);
//     const user = await prisma.user.create({
//       data: { email, password: hashedPassword, name, role: 'USER' }
//     });

//     // Generate tokens
//     const accessToken = generateAccessToken(user.id, user.role);
//     const refreshToken = generateRefreshToken(user.id);

//     return Response.json({
//       accessToken,
//       refreshToken,
//       user: { id: user.id, email: user.email, role: user.role }
//     });
//   } catch (error) {
//     return Response.json({ error: 'Signup failed' }, { status: 500 });
//   }
// }

import prisma from '@/src/lib/db/prisma';
import { hashPassword } from '@/src/lib/auth/password';
import { generateTokenPair } from '@/src/lib/auth/jwt';
import { validateSignupInput } from '@/src/lib/validation/auth';
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
    const { name, email, password } = await req.json();

    const { valid, errors } = validateSignupInput(email, password, name);
    if (!valid) {
      throw new ApiError(errors.join(', '), 400, 'VALIDATION_ERROR');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email already registered', 409, 'USER_EXISTS');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    });

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
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleApiError(error);
  }
};

export const POST = createRateLimitMiddleware(5, 15 * 60 * 1000)(handler);