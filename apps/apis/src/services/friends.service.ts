import { AppError, NotFoundError } from "../errors/errors";
import {
  acceptedFriendRequest,
  getFriendRequests,
  getFriends,
  getRequestById,
  getSingleFriendRequest,
  rejectFriendRequests,
  sendFriendRequest,
} from "../repositories/friends.repository";
import { findUserById } from "../repositories/user.repository";

const sendRequestService = async (senderId: string, receiverId: string) => {
  if (senderId === receiverId) {
    throw new AppError(400, "cannot send request to yourself");
  }

  const user = await findUserById(receiverId);

  if (!user) {
    throw new AppError(400, "user doesn't exists");
  }

  const existingRequest = await getSingleFriendRequest(senderId, receiverId);

  if (existingRequest) {
    throw new AppError(400, "friend request already exists");
  }

  await sendFriendRequest(senderId, receiverId);
};

const getRequestsService = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(400, "user doesn't exists");
  }

  const requests = await getFriendRequests(userId);

  if (requests.length == 0) {
    return null;
  }

  return requests;
};

const acceptRequestService = async (requestId: string, receiverId: string) => {
  const request = await getRequestById(requestId);

  if (!request) {
    throw new AppError(404, "Request doesn't exist");
  }

  if (request.receiverId !== receiverId) {
    throw new AppError(403, "not authorized to accept this");
  }

  if (request.status !== "pending") {
    throw new AppError(400, "request already procceessed");
  }

  const updatedRequest = await acceptedFriendRequest(
    request.senderId,
    request.receiverId,
  );

  return updatedRequest;
};

const rejectRequestService = async (requestId: string, receiverId: string) => {
  const request = await getRequestById(requestId);

  if (!request) {
    throw new AppError(404, "request not existt");
  }

  if (request.receiverId !== receiverId) {
    throw new AppError(403, "not allowed to reject this request");
  }

  if (request.status !== "pending") {
    throw new AppError(400, "request already processed");
  }

  return await rejectFriendRequests(request.senderId, request.receiverId);
};

const getFriendsService = async (userId: string) => {
  const friends = await getFriends(userId);

  if (friends.length == 0) {
    return null;
  }

  return friends;
};

export {
  sendRequestService,
  getRequestsService,
  acceptRequestService,
  rejectRequestService,
  getFriendsService,
};
