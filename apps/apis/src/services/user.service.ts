import { NotFoundError } from "../errors/errors";
import { findUserById, searchUsername } from "../repositories/user.repository";

const getUserByIdService = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new NotFoundError("user not found");
  }

  return user;
};

const searchUsernameService = async (username: string) => {
  const users = await searchUsername(username);

  if (!users) {
    throw new NotFoundError("no user with such username");
  }

  return users;
};

export { getUserByIdService, searchUsernameService };
