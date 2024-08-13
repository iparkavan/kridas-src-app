import Modal from "../../ui/modal";
import UserFollowingList from "./user-following-list";

const UserFollowingModal = (props) => {
  const { userId, userFollowersData, isOpen, onClose } = props;

  const totalFollowingCount =
    userFollowersData?.following?.length + userFollowersData?.events?.length;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Following (${totalFollowingCount})`}
      size="3xl"
    >
      <UserFollowingList userId={userId} />
    </Modal>
  );
};

export default UserFollowingModal;
