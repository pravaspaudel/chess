import { Router } from "express";
import {
  acceptFriendRequestController,
  getFriendsController,
  getRequestsController,
  rejectRequestController,
  sendFriendRequestController,
} from "../controllers/friends.controller";
import protectedRoute from "../middleware/protected.middleware";

const friendRouter = Router();

friendRouter.get("/friends", protectedRoute, getFriendsController);

friendRouter.get("/friends/requests", protectedRoute, getRequestsController);

friendRouter.post(
  "/friends/send/:receiverId",
  protectedRoute,
  sendFriendRequestController,
);
friendRouter.patch(
  "/friends/accept/:requestId",
  protectedRoute,
  acceptFriendRequestController,
);
friendRouter.delete(
  "/friends/reject/:requestId",
  protectedRoute,
  rejectRequestController,
);

export default friendRouter;
