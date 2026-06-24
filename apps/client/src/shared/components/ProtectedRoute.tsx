import useAuthStore from "@/features/auth/store/useAuthStore";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticating = useAuthStore((state) => state.isAuthenticating);
  console.log("protected called ");

  if (isAuthenticating) {
    console.log("isAutneitcating was activated");
    return <div>loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
