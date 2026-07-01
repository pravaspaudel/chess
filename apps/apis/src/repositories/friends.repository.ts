import { db, eq, and } from "@repo/database";
import { friends } from "@repo/database/src/schema/schema";
import logger from "../logger/logger";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
  await db.insert(friends).values({
    senderId,
    receiverId,
    status: "pending",
  });
};

//request send by others to me
const getFriendRequests = async (receiverId: string) => {
  try {
    const requests = await db
      .select()
      .from(friends)
      .where(eq(friends.receiverId, receiverId));

    return requests;
  } catch (error) {
    logger.error("failed to get friend requests ");

    throw error;
  }
};

//chec wheather sender has already send a request to receiver
const getSingleFriendRequest = async (senderId: string, receiverId: string) => {
  try {
    const request = await db
      .select()
      .from(friends)
      .where(
        and(eq(friends.senderId, senderId), eq(friends.receiverId, receiverId)),
      )
      .limit(1);

    return request[0] ?? null;
  } catch (error) {
    logger.error("friend request not send by user ");

    throw error;
  }
};

//accept the request send by user
const acceptedFriendRequest = async (senderId: string, receiverId: string) => {
  try {
    const updateRequest = await db
      .update(friends)
      .set({
        status: "accepted",
      })
      .where(
        and(
          eq(friends.senderId, senderId),
          eq(friends.receiverId, receiverId),
          eq(friends.status, "pending"),
        ),
      )
      .returning();

    return updateRequest[0] ?? null;
  } catch (error) {
    logger.error("Failed to accept friend request", {
      senderId,
      receiverId,
      error,
    });

    throw error;
  }
};

export {
  sendFriendRequest,
  getFriendRequests,
  acceptedFriendRequest,
  getSingleFriendRequest,
};
