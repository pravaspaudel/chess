import { AppError, ValidationError } from "../errors/errors";
import { findUserByEmail, registerUser } from "../repositories/user.repository";
import type { RegisterUserInput } from "../types/user.type";
import { hashedPassword, comparePassword } from "../utils/password";
import logger from "../logger/logger";

const registerUserService = async (user: RegisterUserInput) => {
  const existingUser = await findUserByEmail(user.email);

  if (existingUser) {
    logger.warn("Registration attempted with existing email", {
      email: user.email,
    });

    throw new ValidationError("Email already registered");
  }

  const passwordHashed = await hashedPassword(user.password);

  const createdUser = await registerUser({ ...user, password: passwordHashed });

  if (!createdUser) {
    logger.error(`issue while creating user`, {
      user: createdUser,
    });
    throw new AppError(500, "server error");
  }

  logger.info("User registered successfully", {
    userId: createdUser.id,
    email: createdUser.email,
  });

  return createdUser;
};

export { registerUserService };
