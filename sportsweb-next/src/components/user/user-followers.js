import UserLayout from "../layout/user-layout/user-layout";
import { useUser, useUserFollowersById } from "../../hooks/user-hooks";
import UserFollowersProfile from "./user-followers-profile";

const UserFollowers = () => {
  const { data: userData = {} } = useUser();
  const { data: userFollowersData = [], isLoading } = useUserFollowersById(
    userData?.user_id
  );
  return (
    <UserLayout>
      <UserFollowersProfile
        userFollowersData={userFollowersData}
        userId={userData?.user_id}
      />
    </UserLayout>
  );
};

export default UserFollowers;
