import bcrypt from "bcrypt";

const hashedPassword = (plainText: string) => {
  return bcrypt.hash(plainText, 10);
};

const comparePassword = (plainText: string, hashedPassword: string) => {
  return bcrypt.compare(plainText, hashedPassword);
};

export { hashedPassword, comparePassword };
