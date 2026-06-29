import { useAuthStore } from "@/features/auth";

const ShowProfile = () => {
  const user = useAuthStore((state) => state.user);

  console.log("show profile ran");

  if (!user) {
    return <h1>un authenticated</h1>;
  }

  return (
    <div>
      <span>{user.username}</span>
      <br />
      <span>{user.email}</span>
    </div>
  );
};

export default ShowProfile;
