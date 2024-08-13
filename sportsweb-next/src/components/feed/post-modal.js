import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import UserFeedEditor from "../user/user-feeds/user-feed-Editor";

const PostModal = (props) => {
  const { isOpen, onClose, mode = "view", ...otherProps } = props;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "view"
            ? "Create Post"
            : mode === "edit"
            ? "Edit Post"
            : "Share Post"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={5}>
          <UserFeedEditor mode={mode} {...otherProps} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
