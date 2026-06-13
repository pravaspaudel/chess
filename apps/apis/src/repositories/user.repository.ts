import { db, users, eq } from "@repo/database";
import logger from "../logger/logger";
import type { RegisterUserInput } from "../types/user.type";

const registerUser = async (user: RegisterUserInput) => {
  try {
    const createdUser = await db.insert(users).values(user).returning();

    return createdUser[0] ?? null;
  } catch (error) {
    logger.error("Failed to create user", {
      error,
      user: user.username,
      email: user.email,
    });

    throw error;
  }
};

const findUserByEmail = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user ?? null;
  } catch (error) {
    // console.log(error);

    logger.error("Failed to fetch user by email", {
      error,
      email,
    });

    throw error;
  }
};

const findUserById = async (id: string) => {
  return db.select().from(users).where(eq(users.id, id));
};

export { registerUser, findUserByEmail, findUserById };
