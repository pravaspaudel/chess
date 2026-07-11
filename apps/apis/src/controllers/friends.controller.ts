import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../errors/errors";
import {
  acceptRequestService,
  getFriendsService,
  getRequestsService,
  rejectRequestService,
  sendRequestService,
} from "../services/friends.service";
import { createSuccessResponse } from "../utils/response.body";

const sendFriendRequestController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const user = req.user;

    if (!receiverId || Array.isArray(receiverId)) {
      throw new AppError(400, "invalid params");
    }

    await sendRequestService(user.id, receiverId);

    return res.json(
      createSuccessResponse(200, "friend requests send succcessfully", {}),
    );
  },
);

const getRequestsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const requests = await getRequestsService(user.id);

    return res.json(
      createSuccessResponse(200, "got requests successfully", requests),
    );
  },
);

const acceptFriendRequestController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const user = req.user;

    if (!requestId || Array.isArray(requestId)) {
      throw new AppError(400, "invalid request id");
    }

    const request = await acceptRequestService(requestId, user.id);

    return res.json(
      createSuccessResponse(
        200,
        "friend request accepted successfullyy",
        request,
      ),
    );
  },
);

const rejectRequestController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const user = req.user;

    if (!requestId || Array.isArray(requestId)) {
      throw new AppError(400, "Invalid request id");
    }

    await rejectRequestService(requestId, user.id);

    return res.json(
      createSuccessResponse(200, "friend requests deleted successfully", {}),
    );
  },
);

const getFriendsController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const friends = await getFriendsService(user.id);

    return res.json(
      createSuccessResponse(200, "got friends successfully", friends),
    );
  },
);

export {
  sendFriendRequestController,
  acceptFriendRequestController,
  getRequestsController,
  rejectRequestController,
  getFriendsController,
};
