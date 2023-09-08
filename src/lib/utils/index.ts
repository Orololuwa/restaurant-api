import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */

export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};

export const hasAll = <T extends string>(
  obj: Record<string | number, string>,
  ...val: T[]
): obj is Record<T, string> => !val.some((it) => !obj[it]);

export type UniqueId = string;

export const generateUniqueId = (): UniqueId => uuidv4().slice(0, 8);
