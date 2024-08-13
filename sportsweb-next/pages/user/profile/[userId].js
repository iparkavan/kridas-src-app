import { useRouter } from "next/router";

import UserLayout from "../../../src/components/layout/user-layout/user-layout";
import SessionHelper from "../../../src/helper/session";
import UserCommonHeader from "../../../src/components/user/common-header/common-header-user";
import { useUser, useUserById } from "../../../src/hooks/user-hooks";
import routes from "../../../src/helper/constants/route-constants";
import userService from "../../../src/services/user-service";

const UserPageEdit = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: userDataById = {} } = useUserById(userId);
  const { data: userData = {} } = useUser();

  const currentUser = userId === userData["user_id"];

  return (
    <UserLayout>
      <UserCommonHeader
        currentUser={currentUser}
        userData={currentUser ? userData : userDataById}
      />
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  const sessionProps = await SessionHelper.checkSessionForAuthenicatedPage(
    context
  );
  const userData = await userService.getUser(context.query.userId);
  return {
    redirect: {
      destination: routes.profile(userData["user_name"]),
      permanent: false,
    },
    ...sessionProps,
  };
}

export default UserPageEdit;
