import { db, users, eq, ilike } from "@repo/database";
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
  try {
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));

    return user[0] ?? null;
  } catch (error) {
    logger.error("Failed to fetch user by id", {
      error,
    });

    throw error;
  }
};

const findUserByUsername = async (username: string) => {
  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
  } catch (error) {
    logger.error("Failed to fetch user by username", { error });
    throw error;
  }
};

const searchUsername = async (username: string) => {
  // return await db.select().from(users).where(likes);
  try {
    return await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(ilike(users.username, `%${username}%`));
  } catch (error) {
    logger.error("failed searching user", { error });
    throw error;
  }
};

export {
  registerUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  searchUsername,
};
