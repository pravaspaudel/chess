import "./App.css";
import { RouterProvider } from "react-router";
import router from "./routes/route";
import useAuthStore from "./features/auth/store/useAuthStore";
import { useEffect } from "react";
import { getMe } from "./features/auth/api/auth.api";

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setIsAuthenticating = useAuthStore(
    (state) => state.setIsAuthenticating,
  );

  useEffect(() => {
    const startAuth = async () => {
      try {
        const response = await getMe();

        setUser(response.data);
      } catch {
        logout();
      } finally {
        setIsAuthenticating(false);
      }
    };

    startAuth();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
