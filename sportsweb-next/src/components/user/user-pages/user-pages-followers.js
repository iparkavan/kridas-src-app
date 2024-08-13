import { useRouter } from "next/router";
import { usePageFollowersData } from "../../../hooks/page-hooks";
import PageFollowerList from "./user-page-followers/page-followers-list";
// import PageFollowingList from "./user-page-followers/page-following-list";
import Modal from "../../ui/modal";

const PageFollowers = (props) => {
  const { isOpen, onClose } = props;
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageFollowersData = [] } = usePageFollowersData(pageId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Followers (${pageFollowersData?.companyFollower?.length})`}
      size="3xl"
    >
      <PageFollowerList pageFollowersData={pageFollowersData} />
    </Modal>
  );
};

export default PageFollowers;
