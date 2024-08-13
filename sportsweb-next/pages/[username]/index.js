import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Error from "next/error";
import SessionHelper from "../../src/helper/session";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import UserProfileHeader from "../../src/components/user/profile-section/user-profile-header";
import UserProfileBody from "../../src/components/user/profile-section/user-profile-body";
import { useUser, useUserByUsername } from "../../src/hooks/user-hooks";
/* import Head from "next/head"; */

const UserNameIndex = () => {
  const router = useRouter();
  const { username } = router.query;
  const { tab } = router.query;
  const [tabIndex, setTabIndex] = useState(0);
  const { data: currentUserData = {} } = useUser();
  const { data: userData = {}, isError } = useUserByUsername(
    username,
    currentUserData?.["user_id"]
  );

  const currentUser = currentUserData["user_id"] === userData["user_id"];

  useEffect(() => {
    setTabIndex(0);
  }, [username]);

  useEffect(() => {
    const setDefaultTabIndex = () => {
      switch (tab) {
        case "about":
          setTabIndex(1);
          break;
        case "photos":
          setTabIndex(3);
          break;
        case "videos":
          setTabIndex(4);
          break;
      }
    };
    setDefaultTabIndex();
  }, [setTabIndex, tab]);

  if (isError) {
    return <Error statusCode={404} />;
  }

  return (
    <UserLayout>
      <UserProfileHeader
        currentUser={currentUser}
        userData={currentUser ? currentUserData : userData}
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
      />
      <UserProfileBody
        currentUser={currentUser}
        userData={currentUser ? currentUserData : userData}
        tabIndex={tabIndex}
      />
      {/*   <Head>
        <title>
          {currentUser ? currentUserData?.first_name : userData?.first_name} |
          Kridas
        </title>
      </Head> */}
    </UserLayout>
  );
};

export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}

export default UserNameIndex;
