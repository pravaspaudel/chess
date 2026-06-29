import "./App.css";
import { RouterProvider } from "react-router";
import router from "./routes/route";
import { useEffect } from "react";
import useSocketStore from "./features/games/store/socket";
import useAuthStore from "./features/auth/store/useAuthStore";
import { getMe } from "./features/auth/api/auth.api";

const App = () => {
  const connectSocket = useSocketStore((state) => state.connect);

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

        console.log("app.tsx response.data from startAuth is", response.data);
        console.log("startAuth ran");
      } catch {
        logout();
      } finally {
        setIsAuthenticating(false);
      }
    };

    startAuth();
  }, [setIsAuthenticating, setUser, logout]);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  if (!setIsAuthenticating) {
    return <div>loading....................</div>;
  }

  return <RouterProvider router={router} />;
};

export default App;
