import { useRouter } from "next/router";

import { useUser } from "../../hooks/user-hooks";
import { usePage } from "../../hooks/page-hooks";

import PageCommonHeader from "./common-header-pages/common-header-page";
// import PageLayout from "../layout/page-layout/page-layout";
import UserLayout from "../layout/user-layout/user-layout";

// const PageIndex = ({ products }) => {
const PageIndex = () => {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: userData } = useUser();
  const { data: pageData = {} } = usePage(
    pageId,
    userData?.["user_id"],
    "initialPage"
  );

  const currentPage = userData?.["user_id"] === pageData?.created_by;

  return (
    <UserLayout>
      <PageCommonHeader
        currentPage={currentPage}
        pageData={pageData}
        pageId={pageId}
        // products={products}
      />
    </UserLayout>
  );
};

export default PageIndex;
