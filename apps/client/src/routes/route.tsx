import { createBrowserRouter } from "react-router";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import ProtectedRoute from "@/shared/components/ProtectedRoute";
import ChessPage from "@/features/games/pages/ChessPage";
import Playpaget from "@/features/games/pages/Playpaget";
import HomePage from "@/features/landing/pages/HomePage";
import SocialPage from "@/features/social/pages/SocialPage";
import UserPage from "@/features/social/pages/UserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/play",
    element: <Playpaget />,
  },
  {
    path: "/play/:gameId",
    element: <ChessPage />,
  },
  {
    path: "/social",
    element: <SocialPage />,
  },
  {
    path: "/social/users/:userId",
    element: <UserPage />,
  },
]);

export default router;
