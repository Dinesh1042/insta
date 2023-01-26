import bcrypt from 'bcrypt';

export const hash = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const compare = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
