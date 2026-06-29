import { useAuthStore } from "@/features/auth";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router";

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/play");
    }
  };

  return (
    <div>
      this is a home page
      <Button onClick={handleClick}>let's play chess</Button>
    </div>
  );
};

export default HomePage;
