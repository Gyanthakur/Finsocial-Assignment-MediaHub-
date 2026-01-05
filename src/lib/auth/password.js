// import bcryptjs from 'bcryptjs';

// export const hashPassword = async (password) => {
//   const salt = await bcryptjs.genSalt(10);
//   return bcryptjs.hash(password, salt);
// };

// export const comparePassword = async (password, hash) => {
//   return bcryptjs.compare(password, hash);
// };
import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcryptjs.genSalt(SALT_ROUNDS);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcryptjs.compare(password, hash);
  } catch (error) {
    throw new Error('Failed to compare passwords');
  }
};

export const isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};
