import useAuthStore from "../store/useAuthStore";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1>this is the profile page</h1>

      <span>{user?.id}</span>
      <span>{user?.username}</span>
      <span>{user?.email}</span>
    </div>
  );
};

export default ProfilePage;
