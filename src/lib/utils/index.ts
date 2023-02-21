import * as bcrypt from 'bcrypt';

/** hash password */
const saltRound = 10;
export const createHash = async (password: string) => {
  const hash = await bcrypt.hash(password, saltRound);
  return hash;
};
/** compare hash password */

export const compareHash = async (password: string, hashedPassword: string) => {
  try {
    const bool = await bcrypt.compare(password, hashedPassword);
    return bool;
  } catch (e) {
    throw e;
  }
};
