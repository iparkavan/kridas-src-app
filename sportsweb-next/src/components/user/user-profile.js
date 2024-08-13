import { useRouter } from "next/router";

import UserLayout from "../layout/user-layout/user-layout";
import { useUser } from "../../hooks/user-hooks";
import UserCommonHeader from "./common-header/common-header-user";

const UserProfile = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: userData = {} } = useUser();

  const currentUser = userId !== userData["user_id"];

  return (
    <UserLayout>
      <UserCommonHeader currentUser={currentUser} userData={userData} />
    </UserLayout>
  );
};

export default UserProfile;
