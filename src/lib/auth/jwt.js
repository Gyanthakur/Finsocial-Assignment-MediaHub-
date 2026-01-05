// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;
// const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET;

// export const generateAccessToken = (userId, role) => {
//   return jwt.sign(
//     { userId, role },
//     JWT_SECRET,
//     { expiresIn: '15m' }
//   );
// };

// export const generateRefreshToken = (userId) => {
//   return jwt.sign(
//     { userId },
//     REFRESH_SECRET,
//     { expiresIn: '7d' }
//   );
// };

// export const verifyAccessToken = (token) => {
//   try {
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     throw new Error('Invalid or expired token');
//   }
// };

// export const verifyRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, REFRESH_SECRET);
//   } catch (error) {
//     throw new Error('Invalid or expired refresh token');
//   }
// };

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default-refresh-secret-change-in-production';
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';

export const generateAccessToken = (userId, role, email) => {
  return jwt.sign(
    { userId, role, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
};

export const generateTokenPair = (userId, role, email) => {
  return {
    accessToken: generateAccessToken(userId, role, email),
    refreshToken: generateRefreshToken(userId)
  };
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
