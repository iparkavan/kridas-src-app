import Modal from "../../ui/modal";
import UserFollowerList from "./user-follower-list";

const UserFollowersModal = (props) => {
  const { userFollowersData, isOpen, onClose } = props;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Followers (${userFollowersData?.follower?.length})`}
      size="3xl"
    >
      <UserFollowerList userFollowersData={userFollowersData?.follower} />
    </Modal>
  );
};

export default UserFollowersModal;
