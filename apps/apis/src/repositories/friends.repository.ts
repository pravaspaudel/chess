import { db, eq, and, or, alias, sql } from "@repo/database";
import { friends, users } from "@repo/database/src/schema/schema";
import logger from "../logger/logger";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
  await db.insert(friends).values({
    senderId,
    receiverId,
    status: "pending",
  });
};

//request send by others to receiverId
const getFriendRequests = async (receiverId: string) => {
  const sender = alias(users, "sender");

  try {
    const requests = await db
      .select({
        id: friends.id,
        senderId: friends.senderId,
        senderUsername: sender.username,
      })
      .from(friends)
      .leftJoin(sender, eq(sender.id, friends.senderId))
      .where(
        and(eq(friends.receiverId, receiverId), eq(friends.status, "pending")),
      );

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

const getRequestById = async (requestId: string) => {
  try {
    const request = await db
      .select()
      .from(friends)
      .where(eq(friends.id, requestId));

    return request[0] ?? null;
  } catch (error) {
    logger.error("failed to get request", {
      requestId,
    });

    throw error;
  }
};

const rejectFriendRequests = async (senderId: string, receiverId: string) => {
  try {
    const deleteRequest = await db
      .delete(friends)
      .where(
        and(
          eq(friends.senderId, senderId),
          eq(friends.receiverId, receiverId),
          eq(friends.status, "pending"),
        ),
      )
      .returning();

    return deleteRequest[0] ?? null;
  } catch (error) {
    logger.error("Failed to reject friend request", {
      senderId,
      receiverId,
      error,
    });

    throw error;
  }
};

const getFriends = async (userId: string) => {
  const sender = alias(users, "sender");
  const receiver = alias(users, "receiver");

  try {
    const friens = await db
      .select({
        id: friends.id,
        friendId: sql<string>`
      CASE
        WHEN ${friends.senderId} = ${userId}
        THEN ${receiver.id}
        ELSE ${sender.id}
      END
    `,
        username: sql<string>`
      CASE
        WHEN ${friends.senderId} = ${userId}
        THEN ${receiver.username}
        ELSE ${sender.username}
      END
    `,
      })
      .from(friends)
      .leftJoin(sender, eq(sender.id, friends.senderId))
      .leftJoin(receiver, eq(receiver.id, friends.receiverId))
      .where(
        and(
          or(eq(friends.receiverId, userId), eq(friends.senderId, userId)),
          eq(friends.status, "accepted"),
        ),
      );

    return friens;
  } catch (error) {
    logger.error("failed to get friend requests", {
      userId,
    });

    throw error;
  }
};

export {
  sendFriendRequest,
  getFriendRequests,
  acceptedFriendRequest,
  getSingleFriendRequest,
  getRequestById,
  rejectFriendRequests,
  getFriends,
};
