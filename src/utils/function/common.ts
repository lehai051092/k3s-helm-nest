import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const getHashPassword = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

export const checkPassword = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};

export const getCurrentDate = () => {
  return new Date().toISOString();
};
