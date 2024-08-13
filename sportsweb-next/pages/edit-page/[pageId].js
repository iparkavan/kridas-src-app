import { Skeleton } from "@chakra-ui/react";
import Error from "next/error";
import { useRouter } from "next/router";
import React from "react";
import UserLayout from "../../src/components/layout/user-layout/user-layout";
import UserPageEdit from "../../src/components/user/user-pages/edit-page-component/user-page-edit";
import SessionHelper from "../../src/helper/session";
import { usePage } from "../../src/hooks/page-hooks";
import { useUser } from "../../src/hooks/user-hooks";

const EditPage = () => {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {}, isLoading } = usePage(pageId);
  const { data: userData } = useUser();
  const isPageOwner = pageData?.["created_by"] === userData?.["user_id"];

  return isLoading ? (
    <UserLayout>
      <Skeleton minH={"100vh"}></Skeleton>
    </UserLayout>
  ) : isPageOwner ? (
    <UserLayout>
      <UserPageEdit pageData={pageData} />
    </UserLayout>
  ) : (
    <Error statusCode={404} />
  );
};
export async function getServerSideProps(context) {
  return SessionHelper.checkSessionForAuthenicatedPage(context);
}
export default EditPage;
